import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC  # Example model: Support Vector Machine
from sklearn.metrics import accuracy_score, classification_report

# 1. Load the dataset
df = pd.read_csv('adaptive_algorithm/data/cleaned_stories_dataset.csv')
print(df.head())

# 2. Split data into features and labels
X = df['text']
y = df['final_difficulty']  # Using the 'final_difficulty' column as labels

# 3. Tokenize the text data (using spaCy, as in your analyze.py)
# ... (Insert the same tokenization code from analyze.py here) ...

# 4. Convert tokenized text to sentence embeddings
model = SentenceTransformer('all-mpnet-base-v2')

def get_embeddings(tokens):
    return model.encode(" ".join(tokens))

X = X.apply(get_embeddings)
print(X.head())

# 5. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Model Selection and Training (Example with SVM)
svm_classifier = SVC(kernel='linear')  # Initialize SVM classifier
svm_classifier.fit(X_train, y_train)  # Train the model

# 7. Evaluate the model
y_pred = svm_classifier.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy}")
print(classification_report(y_test, y_pred))

# 8. Save the trained model (optional, but recommended)
import pickle
filename = 'adaptive_algorithm/models/svm_model.sav'
pickle.dump(svm_classifier, open(filename, 'wb'))