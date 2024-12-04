const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {spawn} = require("child_process");

admin.initializeApp();
const db = admin.firestore();

exports.getStories = functions.https.onCall(
    async (data, context) => {
      try {
        const storiesRef = db.collection("stories");
        const snapshot = await storiesRef.get();
        const stories = [];
        snapshot.forEach((doc) => {
          stories.push({id: doc.id, ...doc.data()});
        });
        return stories;
      } catch (error) {
        console.error("Error fetching stories:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Error fetching stories",
        );
      }
    },
);

exports.analyzeText = functions.https.onCall(
    async (data, context) => {
      const {text, storyId, userId} = data;

      return new Promise((resolve, reject) => {
        const pythonProcess = spawn(
            "python",
            ["../adaptive_algorithm/analyze.py", text, storyId],
        );

        let adjustedText = "";
        pythonProcess.stdout.on("data", (processOutput) => {
          adjustedText += processOutput;
        });

        pythonProcess.stderr.on("data", (errorData) => {
          console.error(`Error from Python: ${errorData}`);
          reject(
              new functions.https.HttpsError(
                  "internal",
                  "Error analyzing text",
              ),
          );
        });

        pythonProcess.on("close", async (code) => {
          if (code !== 0) {
            console.error(`Python process exited with code ${code}`);
            reject(
                new functions.https.HttpsError(
                    "internal",
                    "Error analyzing text",
                ),
            );
          }

          try {
            const result = JSON.parse(adjustedText.trim());
            const userDoc = await db.collection("users").doc(userId).get();
            const userData = userDoc.data();

            const newTotalWordsRead =
            (userData.progress.totalWordsRead || 0) +
            result.adjustedText.split(/\s+/).length;

            await db
                .collection("users")
                .doc(userId)
                .update({
                  "progress.totalWordsRead": newTotalWordsRead,
                });

            resolve({adjustedText: result.adjustedText});
          } catch (error) {
            console.error(
                "Error parsing JSON or updating Firestore:",
                error,
            );
            reject(
                new functions.https.HttpsError(
                    "internal",
                    "Error analyzing text",
                ),
            );
          }
        });
      });
    },
);

exports.updateSettings = functions.https.onCall(
    async (data, context) => {
      const {uid, settings} = data;
      try {
        const userDoc = db.collection("users").doc(uid);
        await userDoc.update({settings});
        return {message: "Settings updated successfully"};
      } catch (error) {
        console.error("Error updating settings:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Error updating settings",
        );
      }
    },
);

exports.getParentData = functions.https.onCall(
    async (data, context) => {
      const {parentEmail} = data;
      try {
        const parentQuery = await db
            .collection("users")
            .where("email", "==", parentEmail)
            .get();
        if (parentQuery.empty) {
          throw new functions.https.HttpsError(
              "not-found",
              "Parent not found",
          );
        }
        const parentDoc = parentQuery.docs[0];
        const parentData = parentDoc.data();

        const childrenQuery = await db
            .collection("users")
            .where("parentEmail", "==", parentEmail)
            .get();

        const childrenData = childrenQuery.docs.map((doc) => doc.data());

        return {parent: parentData, children: childrenData};
      } catch (error) {
        console.error("Error fetching parent data:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Error fetching parent data",
        );
      }
    },
);

exports.addChild = functions.https.onCall(async (data, context) => {
  const {childData} = data;
  try {
    const user = await admin.auth().createUser({
      email: childData.email,
      password: childData.password,
    });

    await db.collection("users").doc(user.uid).set({
      username: childData.username,
      email: childData.email,
      role: "child",
      parentEmail: childData.parentEmail,
      progress: {totalWordsRead: 0, storiesCompleted: 0, badgesEarned: []},
    });

    return {message: "Child account created successfully"};
  } catch (error) {
    console.error("Error adding child:", error);
    throw new functions.https.HttpsError("internal", "Error adding child");
  }
});
