(window.SEED=window.SEED||{})["Artificial Intelligence"]={
 "AI basics": [
  {
   "t": "Artificial intelligence (AI) is software that does tasks that normally need human intelligence, such as recognizing speech, understanding language, making decisions or spotting patterns."
  },
  {
   "t": "Machine learning (ML) is a way of building AI where the program learns patterns from examples (data) instead of following rules that a person wrote by hand.",
   "k": "what is machine learning definition"
  },
  {
   "t": "Deep learning is machine learning that uses neural networks with many layers. It powers modern image recognition, speech recognition and language models."
  },
  {
   "t": "Narrow AI does one kind of task well, such as translating text or recommending videos. General AI, which could do any intellectual task a person can, does not exist today."
  },
  {
   "t": "A rule-based AI follows if-then rules written by people. A learning-based AI finds its own rules from data. Rule-based systems are predictable and easy to explain, while learning systems handle messy real-world data better."
  },
  {
   "t": "An algorithm is a step-by-step procedure. A model is what a machine learning algorithm produces after training: a set of numbers (parameters) that turns inputs into outputs."
  },
  {
   "t": "Training is the expensive step where a model is fitted to data. Inference is using the trained model to make a prediction on new input, which is much cheaper."
  },
  {
   "t": "This app's AI is rule-based and library-based: it matches your words to leaves in its Library. It does not train a neural network, and it only knows what the starter sections, your feeding and your teaching put in."
  },
  {
   "t": "The term artificial intelligence was coined for a workshop at Dartmouth College in 1956, which is often called the birth of AI as a field."
  },
  {
   "t": "Alan Turing proposed a test in 1950: if a person chatting by text cannot tell whether the other side is a machine or a human, the machine can be said to show intelligent behavior. This is the Turing test."
  },
  {
   "t": "An AI winter is a period when funding and interest in AI dropped because the technology had not met its promises. There were two big ones, in the 1970s and in the late 1980s."
  },
  {
   "t": "IBM's Deep Blue beat the chess champion Garry Kasparov in 1997, and DeepMind's AlphaGo beat the Go champion Lee Sedol in 2016. Both were milestones for game-playing AI."
  },
  {
   "t": "Computer vision is AI that understands images and video, such as recognizing faces, reading text in photos or spotting defects. Natural language processing (NLP) is AI that works with human language, such as translation and chatbots."
  }
 ],
 "Training and evaluation": [
  {
   "t": "Split your data into three parts: a training set to learn from, a validation set to tune choices, and a test set kept untouched to measure the final result. A common split is 70, 15 and 15 percent."
  },
  {
   "t": "Overfitting is when a model memorizes the training data, noise included, and does badly on new data. Signs are very high training accuracy but much lower test accuracy."
  },
  {
   "t": "Underfitting is when a model is too simple to catch the pattern, so it does badly even on the training data. Fixes include a bigger model, better features or longer training."
  },
  {
   "t": "To fight overfitting, use more data, a simpler model, regularization, dropout or early stopping. Regularization adds a penalty for large weights so the model stays simpler."
  },
  {
   "t": "A loss function measures how wrong the model's predictions are with a single number. Training tries to make the loss as small as possible. Mean squared error is common for numbers, and cross-entropy for categories."
  },
  {
   "t": "An epoch is one full pass through the training data. A batch is the small group of examples used for one weight update. Training usually runs many epochs."
  },
  {
   "t": "A hyperparameter is a setting you choose before training, such as the learning rate, the number of layers or the batch size. A parameter, by contrast, is learned from the data."
  },
  {
   "t": "Accuracy is the share of predictions that are right. It can mislead on unbalanced data: if 99 percent of emails are not spam, a model that always says not spam is 99 percent accurate and useless."
  },
  {
   "t": "Precision is how many of the items the model flagged were really positive. Recall is how many of the real positives the model found. A spam filter with high precision rarely blocks good mail, and one with high recall misses little spam.",
   "k": "precision recall measure classifier"
  },
  {
   "t": "The F1 score combines precision and recall into one number, using their harmonic mean. It is high only when both are high."
  },
  {
   "t": "A confusion matrix is a table that counts true positives, false positives, true negatives and false negatives. It shows exactly which kinds of mistakes a classifier makes."
  },
  {
   "t": "Cross-validation tests a model several times, each time holding out a different slice of the data for testing, then averages the results. It gives a steadier estimate when data is scarce."
  },
  {
   "t": "Data leakage is when information from the test set or the future sneaks into training, making results look better than they will be in real use. Always split the data before any step that learns from it."
  },
  {
   "t": "Always compare a model with a simple baseline, such as always predicting the most common answer or using the average. If a complex model barely beats the baseline, it may not be worth using."
  },
  {
   "t": "Garbage in, garbage out: a model is only as good as its data. Clean, varied and correctly labeled data usually helps more than a fancier algorithm."
  },
  {
   "t": "Bias in AI usually comes from the data. If the training data under-represents a group or reflects past unfair decisions, the model can repeat or amplify them. Check results separately for different groups."
  }
 ],
 "Language models": [
  {
   "t": "A large language model (LLM) is a neural network trained on huge amounts of text to predict the next token. By repeating that step, it can write answers, summaries, code and more."
  },
  {
   "t": "A token is a chunk of text a model reads, usually a word or part of a word. In English, a token is about three-quarters of a word on average."
  },
  {
   "t": "Pretraining teaches an LLM general language from a vast amount of text. Fine-tuning then trains it further on narrower examples, such as following instructions or a company's style."
  },
  {
   "t": "Reinforcement learning from human feedback (RLHF) improves a model using people's ratings of its answers, so it becomes more helpful and less harmful. Similar methods use AI feedback guided by written principles."
  },
  {
   "t": "The context window is how much text a model can consider at once, counting both your input and its reply. Anything outside the window is invisible to the model unless it is added again."
  },
  {
   "t": "Temperature controls randomness when a model picks the next token. Low temperature gives steady, predictable answers. High temperature gives more varied and creative ones, with more risk of errors."
  },
  {
   "t": "A hallucination is when a model states something false in a confident tone, such as an invented quote or source. Models predict plausible text and do not look facts up unless they are given tools to do so."
  },
  {
   "t": "An embedding turns text into a list of numbers so that similar meanings sit close together. Embeddings power semantic search, recommendations and retrieval."
  },
  {
   "t": "Retrieval-augmented generation (RAG) first searches a collection of documents for relevant passages, then gives them to the model to base its answer on. It reduces hallucination and lets a model use private or recent information."
  },
  {
   "t": "A prompt is the input you give a model. A system prompt is a standing instruction, such as a role or rules, that frames the whole conversation."
  },
  {
   "t": "Few-shot prompting means putting a few examples of the task in the prompt so the model copies the pattern. Zero-shot means asking with no examples."
  },
  {
   "t": "Chain-of-thought prompting asks a model to reason step by step before answering. It often improves results on math and logic problems."
  },
  {
   "t": "An AI agent is a model that can use tools, such as searching the web, running code or reading files, and takes several steps toward a goal. Check what an agent is allowed to do before trusting it with important actions."
  },
  {
   "t": "A model's knowledge stops at its training cutoff. For anything recent, it needs a search tool or documents supplied in the prompt."
  },
  {
   "t": "Models are also trained to be multimodal, meaning they can take in or produce more than text, such as images, audio and video."
  }
 ],
 "Using AI well": [
  {
   "t": "A good prompt states the task, gives the needed context, says who the answer is for, and names the format you want, such as a short list or a table. Specific requests get better answers than vague ones."
  },
  {
   "t": "If an answer is not what you wanted, say what is wrong and what you want instead, or give an example of the style. Refining over a few turns usually beats rewriting the whole prompt."
  },
  {
   "t": "Check what an AI tells you, especially names, numbers, quotes, laws and medical or legal advice. Ask for sources and open them. Treat the answer as a draft from a fast assistant, not as proof."
  },
  {
   "t": "Do not paste passwords, private keys, medical records or other secrets into an AI tool unless you know how that tool stores and uses the data. When unsure, remove names and numbers first."
  },
  {
   "t": "When AI helps write code, read it before running it, test it, and make sure you understand what it does. Never run code you do not understand on important data."
  },
  {
   "t": "Keep a person in the loop for decisions that affect people, such as hiring, grading, lending or health. AI can suggest, but someone should be able to review and correct the result."
  },
  {
   "t": "AI-generated text and images may copy patterns from their training data. Rules on copyright and on disclosing AI use differ by place, school and employer, so check the rules that apply to you before publishing."
  },
  {
   "t": "To tell whether an AI claim is reliable, ask: what data was it trained on, how was it tested, and what is its error rate on cases like mine? A single impressive demo is not evidence."
  },
  {
   "t": "AI safety is the work of making AI systems behave as intended and avoid harm, from everyday issues such as bias and misuse to making sure powerful systems stay under human control."
  },
  {
   "t": "Explainability means being able to say why an AI gave an answer. Simple models like decision trees are easy to explain, while large neural networks are hard to explain, which matters in high-stakes uses."
  }
 ],
 "Learning types": [
  {
   "t": "Supervised learning trains on examples that already have the right answer (labels), such as photos marked cat or dog. The model learns to predict the label for new inputs."
  },
  {
   "t": "Unsupervised learning looks for structure in data that has no labels. A common example is clustering, which groups similar customers or documents together."
  },
  {
   "t": "Reinforcement learning trains an agent by trial and error. It takes actions, gets rewards or penalties, and learns a strategy that earns the most reward over time. It is used for games and robot control."
  },
  {
   "t": "Self-supervised learning makes its own labels from the data, for example by hiding a word and asking the model to predict it. This is how large language models learn from huge amounts of plain text."
  },
  {
   "t": "Classification predicts a category, such as spam or not spam. Regression predicts a number, such as the price of a house or tomorrow's temperature."
  },
  {
   "t": "Clustering groups similar items without being told the groups. K-means is a popular clustering method: it picks k centers and moves them until each item sits with its nearest center."
  },
  {
   "t": "Dimensionality reduction squeezes many features into fewer while keeping most of the information. It helps with visualizing data and speeding up models. PCA is a common method."
  },
  {
   "t": "Anomaly detection finds unusual items, such as a fraudulent card payment or a failing machine. The model learns what normal looks like and flags what does not fit."
  },
  {
   "t": "A recommender system suggests items you may like. It uses what you did before, what similar people liked, or the content of the items, and often a mix of these."
  },
  {
   "t": "K-nearest neighbors (KNN) classifies a new item by looking at the k most similar items in the training data and taking a vote. It is simple and needs no training step, but gets slow on big data."
  },
  {
   "t": "A decision tree asks a series of yes-or-no questions about the features to reach a prediction. It is easy to read and explain. A random forest averages many trees to be more accurate."
  },
  {
   "t": "Linear regression fits a straight line to data to predict a number. Logistic regression, despite its name, is used for classification: it predicts a probability between 0 and 1."
  }
 ],
 "Layers and weights": [
  {
   "t": "A neural network is a model made of layers of simple units called neurons. Each neuron multiplies its inputs by weights, adds a bias, and passes the result through an activation function."
  },
  {
   "t": "Weights are the numbers a neural network learns. Training adjusts millions or billions of weights so that the network's outputs get closer to the right answers."
  },
  {
   "t": "An activation function adds a bend so the network can learn more than straight-line patterns. ReLU, which outputs zero for negative numbers and the number itself otherwise, is the most common choice today. Sigmoid squeezes values between 0 and 1."
  },
  {
   "t": "A neural network has an input layer that takes the data, hidden layers in the middle that find patterns, and an output layer that gives the answer. Deep means many hidden layers."
  },
  {
   "t": "Backpropagation is how a neural network learns. It works out how much each weight contributed to the error, going from the output back to the input, so every weight can be nudged the right way."
  },
  {
   "t": "Gradient descent adjusts the weights a little at a time in the direction that lowers the loss, like walking downhill in fog by feeling the slope. The learning rate is the step size: too big overshoots, too small is slow."
  },
  {
   "t": "A convolutional neural network (CNN) slides small filters over an image to find edges, then shapes, then objects. CNNs were the main tool for image recognition for years."
  },
  {
   "t": "A recurrent neural network (RNN) reads a sequence one step at a time and keeps a memory of what came before. LSTM and GRU are versions that remember longer. Transformers have mostly replaced them for language."
  },
  {
   "t": "The transformer is a neural network design from 2017 that uses attention to let every word look at every other word at once. It is the basis of modern large language models."
  },
  {
   "t": "Attention lets a model decide which parts of the input matter most for each output. When a model reads a sentence, attention helps it link a pronoun to the noun it refers to."
  },
  {
   "t": "The number of parameters is the count of learned weights in a model. Small models have millions, and the biggest language models have hundreds of billions or more."
  },
  {
   "t": "A GPU (graphics processing unit) does many simple calculations at the same time, which suits neural networks. Training large models needs thousands of GPUs, while running a small model can work on a phone."
  },
  {
   "t": "Softmax turns a list of scores into probabilities that add up to 1. A classifier uses it at the end to say how likely each category is."
  }
 ],
 "Code examples": [
  {
   "t": "import random\n\ndata = list(range(100))\nrandom.seed(1)\nrandom.shuffle(data)\ncut = int(len(data) * 0.8)\ntrain, test = data[:cut], data[cut:]\nprint(len(train), len(test))",
   "code": 1,
   "k": "train test split python shuffle example machine learning data split data into training and test sets in plain python"
  },
  {
   "t": "xs = [1, 2, 3, 4, 5]\nys = [3, 5, 7, 9, 11]\nw, b, lr = 0.0, 0.0, 0.01\nfor _ in range(5000):\n    dw = db = 0.0\n    for x, y in zip(xs, ys):\n        err = (w * x + b) - y\n        dw += 2 * err * x / len(xs)\n        db += 2 * err / len(xs)\n    w -= lr * dw\n    b -= lr * db\nprint(round(w, 2), round(b, 2))",
   "code": 1,
   "k": "gradient descent linear regression python example fit line learning rate loss fit a straight line with gradient descent in plain python"
  },
  {
   "t": "data = [((0, 0), 0), ((0, 1), 0), ((1, 0), 0), ((1, 1), 1)]\nw = [0.0, 0.0]\nb = 0.0\nfor _ in range(20):\n    for (x1, x2), target in data:\n        out = 1 if w[0] * x1 + w[1] * x2 + b > 0 else 0\n        err = target - out\n        w[0] += 0.1 * err * x1\n        w[1] += 0.1 * err * x2\n        b += 0.1 * err\nprint([1 if w[0] * x1 + w[1] * x2 + b > 0 else 0 for (x1, x2), _ in data])",
   "code": 1,
   "k": "perceptron neuron python example neural network learn and function weights train a perceptron that learns the and function"
  },
  {
   "t": "def scores(actual, predicted):\n    tp = sum(a == 1 and p == 1 for a, p in zip(actual, predicted))\n    fp = sum(a == 0 and p == 1 for a, p in zip(actual, predicted))\n    fn = sum(a == 1 and p == 0 for a, p in zip(actual, predicted))\n    acc = sum(a == p for a, p in zip(actual, predicted)) / len(actual)\n    precision = tp / (tp + fp) if tp + fp else 0\n    recall = tp / (tp + fn) if tp + fn else 0\n    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0\n    return acc, precision, recall, f1\n\nprint(scores([1, 0, 1, 1, 0, 0], [1, 0, 0, 1, 1, 0]))",
   "code": 1,
   "k": "python example evaluate classifier code scores from predictions"
  },
  {
   "t": "from collections import Counter\n\ntrain = [((1, 1), \"a\"), ((1, 2), \"a\"), ((5, 5), \"b\"), ((6, 5), \"b\")]\n\ndef knn(point, k=3):\n    near = sorted(train, key=lambda t: (t[0][0] - point[0]) ** 2 + (t[0][1] - point[1]) ** 2)[:k]\n    return Counter(label for _, label in near).most_common(1)[0][0]\n\nprint(knn((2, 1)), knn((5, 6)))",
   "code": 1,
   "k": "k nearest neighbors knn python example classify code classify with k-nearest neighbors in plain python"
  },
  {
   "t": "import math\n\ndef softmax(scores):\n    m = max(scores)\n    exps = [math.exp(s - m) for s in scores]\n    total = sum(exps)\n    return [e / total for e in exps]\n\nprint([round(p, 3) for p in softmax([2.0, 1.0, 0.1])])",
   "code": 1,
   "k": "softmax probabilities python example neural network output code softmax turns scores into probabilities"
  }
 ]
};
