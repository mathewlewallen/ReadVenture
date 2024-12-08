"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParentSettings = exports.getReadingAnalytics = exports.getParentChildren = exports.updateUserSettings = exports.trackReadingProgress = exports.getChildrenAnalytics = exports.analyzeText = void 0;
const child_process_1 = require("child_process");
const functions = __importStar(require("firebase-functions"));
// Custom error types
var AnalysisErrorType;
(function (AnalysisErrorType) {
    AnalysisErrorType["VALIDATION"] = "validation_error";
    AnalysisErrorType["PYTHON"] = "python_error";
    AnalysisErrorType["DATABASE"] = "database_error";
    AnalysisErrorType["PARSING"] = "parsing_error";
})(AnalysisErrorType || (AnalysisErrorType = {}));
exports.analyzeText = functions.https.onCall(async (data, context) => {
    try {
        // Authentication check
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        // Input validation
        if (!data.text?.trim()) {
            throw new functions.https.HttpsError('invalid-argument', 'Text content is required');
        }
        if (!data.storyId?.trim()) {
            throw new functions.https.HttpsError('invalid-argument', 'Story ID is required');
        }
        if (!data.userId?.trim()) {
            throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
        }
        return new Promise((resolve, reject) => {
            const pythonProcess = (0, child_process_1.spawn)('python', [
                '../adaptive_algorithm/analyze.py',
                data.text,
                data.storyId,
            ]);
            let output = '';
            let errorOutput = '';
            pythonProcess.stdout.on('data', chunk => (output += chunk));
            pythonProcess.stderr.on('data', chunk => (errorOutput += chunk));
            pythonProcess.on('error', error => {
                console.error('Python process error:', error);
                reject(new functions.https.HttpsError('internal', 'Failed to start analysis process', { type: AnalysisErrorType.PYTHON, details: error }));
            });
            pythonProcess.on('close', async (code) => {
                if (code !== 0) {
                    console.error(`Analysis process failed with code ${code}:`, errorOutput);
                    reject(new functions.https.HttpsError('internal', 'Analysis process failed', { type: AnalysisErrorType.PYTHON, code, error: errorOutput }));
                    return;
                }
                try {
                    const result = JSON.parse(output.trim());
                    const userRef = db.collection('users').doc(data.userId);
                    try {
                        await db.runTransaction(async (transaction) => {
                            const userDoc = await transaction.get(userRef);
                            if (!userDoc.exists) {
                                throw new functions.https.HttpsError('not-found', 'User not found', { type: AnalysisErrorType.DATABASE });
                            }
                            const userData = userDoc.data();
                            const wordCount = result.adjustedText.split(/\s+/).length;
                            transaction.update(userRef, {
                                'progress.totalWordsRead': (userData.progress?.totalWordsRead || 0) + wordCount,
                            });
                        });
                        resolve({
                            adjustedText: result.adjustedText,
                            wordCount: result.adjustedText.split(/\s+/).length,
                        });
                    }
                    catch (dbError) {
                        console.error('Database transaction error:', dbError);
                        reject(new functions.https.HttpsError('internal', 'Failed to update user progress', { type: AnalysisErrorType.DATABASE, details: dbError }));
                    }
                }
                catch (parseError) {
                    console.error('Result parsing error:', parseError, 'Output:', output);
                    reject(new functions.https.HttpsError('internal', 'Failed to parse analysis results', { type: AnalysisErrorType.PARSING, details: parseError }));
                }
            });
        });
    }
    catch (error) {
        console.error('Unexpected analysis error:', error);
        throw new functions.https.HttpsError('internal', 'Analysis failed unexpectedly', { type: AnalysisErrorType.VALIDATION, details: error });
    }
});
// Parent Dashboard Analytics
exports.getChildrenAnalytics = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        const { parentId } = data;
        const db = admin.firestore();
        // Get children under this parent
        const childrenQuery = await db
            .collection('users')
            .where('parentEmail', '==', context.auth.token.email)
            .get();
        const analyticsPromises = childrenQuery.docs.map(async (childDoc) => {
            const progressQuery = await db
                .collection('progress')
                .where('userId', '==', childDoc.id)
                .orderBy('timestamp', 'desc')
                .limit(30)
                .get();
            const progress = progressQuery.docs.map(doc => doc.data());
            return {
                childId: childDoc.id,
                displayName: childDoc.data().displayName,
                progress: {
                    totalWordsRead: progress.reduce((sum, p) => sum + (p.wordCount || 0), 0),
                    storiesCompleted: progress.length,
                    averageAccuracy: progress.reduce((sum, p) => sum + (p.accuracy || 0), 0) /
                        progress.length,
                    lastActivity: progress[0]?.timestamp,
                },
            };
        });
        return Promise.all(analyticsPromises);
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to fetch analytics', error);
    }
});
// Progress Tracking
exports.trackReadingProgress = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        const { storyId, wordCount, accuracy, completionTime } = data;
        const userId = context.auth.uid;
        const db = admin.firestore();
        const progressData = {
            userId,
            storyId,
            wordCount,
            accuracy,
            completionTime,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        await db.collection('progress').add(progressData);
        // Update user's total progress
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'User not found');
            }
            const userData = userDoc.data();
            transaction.update(userRef, {
                'stats.totalWordsRead': (userData?.stats?.totalWordsRead || 0) + wordCount,
                'stats.storiesCompleted': (userData?.stats?.storiesCompleted || 0) + 1,
            });
        });
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to track progress', error);
    }
});
// User Management
exports.updateUserSettings = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        const { userId, settings } = data;
        const db = admin.firestore();
        // Verify parent-child relationship if updating child settings
        if (userId !== context.auth.uid) {
            const parentQuery = await db
                .collection('users')
                .where('parentEmail', '==', context.auth.token.email)
                .where('userId', '==', userId)
                .get();
            if (parentQuery.empty) {
                throw new functions.https.HttpsError('permission-denied', 'Not authorized to modify this user');
            }
        }
        await db.collection('users').doc(userId).update({
            settings,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to update user settings', error);
    }
});
// Get parent-child relationship
exports.getParentChildren = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        const db = admin.firestore();
        const childrenQuery = await db
            .collection('users')
            .where('parentEmail', '==', context.auth.token.email)
            .get();
        const children = childrenQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return { children };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to fetch children', error);
    }
});
// Get detailed reading analytics
exports.getReadingAnalytics = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        const { userId, timeRange } = data;
        const db = admin.firestore();
        const progressQuery = await db
            .collection('progress')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(timeRange || 30)
            .get();
        const analytics = {
            totalTime: 0,
            averageAccuracy: 0,
            totalWords: 0,
            readingSessions: progressQuery.docs.map(doc => doc.data()),
        };
        analytics.readingSessions.forEach(session => {
            analytics.totalTime += session.completionTime || 0;
            analytics.totalWords += session.wordCount || 0;
        });
        analytics.averageAccuracy =
            analytics.readingSessions.reduce((sum, session) => sum + (session.accuracy || 0), 0) / analytics.readingSessions.length;
        return analytics;
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to fetch analytics', error);
    }
});
// Update parent settings
exports.updateParentSettings = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
        }
        const { settings } = data;
        const db = admin.firestore();
        const userRef = db.collection('users').doc(context.auth.uid);
        await userRef.update({
            settings,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            isParent: true,
        });
        return { success: true };
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Failed to update parent settings', error);
    }
});
//# sourceMappingURL=index.js.map