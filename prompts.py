MCQ_TEMPLATE = """
You are an Academic AI assistant tasked with generating multiple-choice questions on various topics on the given subject and following the syllabus.

Give me {num} number of numerical questions based on the following parameters:
Subject: {subject}
difficulty level: {level}

Syllabus and Course Outcomes:
{syllabus}

NOTE: The questions should be fun and easy to answer for grade 8th students.

Please keep the following points in mind before creating questions
1. Each question should have 4 unique options, and only 1 correct out of them.
2. Course Outcomes should be matched with the topic of the questions.
3. Bloom's level can be "Knowing", "Understanding", "Analyzing", "Applying", "Evaluating", "Creating"
4. Make sure to add all kinds of difficulty level: easy, medium and hard (try to keep it in the ratio of 3:3:2).
5. Metadata should contain 'subject', 'topic', 'subtopic'.
6. Generate a concise explanation for each question.
7. Make sure to not include any Latex formatting in the response.

Please ensure variety in questions. 
Please strictly ensure to the response is in json formatting as mentioned below:
{format_instructions}
"""

FIB_TEMPLATE = """
You are an Academic AI assistant tasked with generating fill-in-the-blanks questions on various topics within the given subject and following the syllabus.
Give me {num} number of fill-in-the-blanks questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Syllabus and Course Outcomes:
{syllabus}

NOTE: The questions should be engaging and appropriate for 8th-grade students.
Please keep the following points in mind before creating questions:

1) Each question should have one or two blanks to be filled.
2) Provide the correct answer(s) for each blank.
3) Course Outcomes should be matched with the topic of the questions.
4) Bloom's level can be "Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", or "Creating".
5) Make sure to include a mix of difficulty levels: easy, medium, and hard (try to keep it in the ratio of 3:3:2).
6) Metadata should contain 'subject', 'topic', 'subtopic'.
7) Generate a concise explanation for each question.
8) Make sure not to include any LaTeX formatting in the response.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""


DL_SYLLABUS = """

Course Outcomes:
1 Gain basic knowledge of Neural Networks.
2 Acquire in depth understanding of training Deep Neural Networks.
3 Design appropriate DNN model for supervised, unsupervised and sequence learning
applications.
4 Gain familiarity with recent trends and applications of Deep Learning.

1 Fundamentals of Neural Network 4
1.1 History of Deep Learning, Deep Learning Success Stories, Multilayer
Perceptrons (MLPs), Representation Power of MLPs, Sigmoid Neurons
Gradient Descent, Feedforward Neural Networks, Representation Power
of Feedforward Neural Networks
1.2 Deep Networks: Three Classes of Deep Learning Basic Terminologies
of Deep Learning
2 Training, Optimization and Regularization of Deep Neural
Network
10
2.1 Training Feedforward DNN
Multi Layered Feed Forward Neural Network, Learning Factors, Activation
functions: Tanh, Logistic, Linear, Softmax, ReLU, Leaky ReLU, Loss
functions: Squared Error loss, Cross Entropy, Choosing
output function and loss function
2.2 Optimization
Learning with backpropagation, Learning Parameters: Gradient
Descent (GD), Stochastic and Mini Batch GD, Momentum Based GD,
Nesterov Accelerated GD, AdaGrad, Adam, RMSProp
2.3 Regularization
Overview of Overfitting, Types of biases, Bias Variance Tradeoff
Regularization Methods: L1, L2 regularization, Parameter sharing,
Dropout, Weight Decay, Batch normalization, Early stopping, Data
Augmentation, Adding noise to input and output
3 Autoencoders: Unsupervised Learning 6
3.1 Introduction, Linear Autoencoder, Undercomplete Autoencoder,
Overcomplete Autoencoders, Regularization in Autoencoders
3.2 Denoising Autoencoders, Sparse Autoencoders, Contractive
Autoencoders
3.3 Application of Autoencoders: Image Compression
4 Convolutional Neural Networks (CNN): Supervised Learning 7
4.1 Convolution operation, Padding, Stride, Relation between input, output and
filter size, CNN architecture: Convolution layer, Pooling Layer, Weight Sharin
in CNN, Fully Connected NN vs CNN, Variants of basic Convolution function
Multichannel convolution operation,2D convolution.
4.2 Modern Deep Learning Architectures:
LeNET: Architecture, AlexNET: Architecture, ResNet : Architecture
5 Recurrent Neural Networks (RNN) 8
5.1 Sequence Learning Problem, Unfolding Computational graphs,
Recurrent Neural Network, Bidirectional RNN, Backpropagation Through
Time (BTT), Limitation of “ vanilla RNN” Vanishing and Exploding
Gradients, Truncated BTT
5.2 Long Short Term Memory(LSTM): Selective Read, Selective write,
Selective Forget, Gated Recurrent Unit (GRU)
6 Recent Trends and Applications 4
6.1 Generative Adversarial Network (GAN): Architecture
6.2 Applications: Image Generation, DeepFake


"""


CSS_SYLLABUS = """
Course Outcomes:
1 Identify information security goals, classical encryption techniques and acquire fundamental
knowledge on the concepts of finite fields and number theory.
2 Understand, compare and apply different encryption and decryption techniques to solve
problems related to confidentiality and authentication
3 Apply the knowledge of cryptographic checksums and evaluate the performance of different
message digest algorithms for verifying the integrity of varying message sizes
4 Apply different digital signature algorithms to achieve authentication and create secure
applications .
5 Apply network security basics, analyze different attacks on networks and evaluate the
performance of firewalls and security protocols like SSL, IPSec, and PGP
6 Apply the knowledge of cryptographic utilities and authentication mechanisms to design
secure applications

1 Introduction & Number Theory
1.1 Services, Mechanisms and attacks-the OSI security architecture-Network
security model-Classical Encryption techniques (Symmetric cipher model,
mono-alphabetic and poly-alphabetic substitution techniques: Vignere
cipher, playfair cipher, Hill cipher, transposition techniques: keyed and
keyless transposition ciphers, steganography).
7
2 Block Ciphers & Public Key Cryptography 7
2.1 Data Encryption Standard-Block cipher principles-block cipher modes of
operationAdvanced Encryption Standard (AES)-Triple DES-Blowfish-RC5
algorithm. Public key cryptography: Principles of public key
cryptosystems- The RSA algorithm, The knapsack algorithm, El-Gamal
Algorithm. Key management – Diffie Hellman Key exchange
3 Cryptographic Hashes, Message Digests and Digital Certificates 7
3.1 Authentication requirement – Authentication function,Typesof
Authentication, MAC – Hash function – Security of hash function and
MAC
–MD5 – SHA – HMAC – CMAC, Digital Certificate: X.509, PKI
4 Digital signature schemes and authentication Protocols 6
4.1 Digital signature and authentication protocols : Needham Schroeder
Authentication protocol, Digital Signature Schemes – RSA .
5 System Security 6
Operating System Security: Memory and Address Protection, File Protection
Mechanism, User Authentication. Linux and Windows: Vulnerabilities, File
System Security
Database Security: Database Security Requirements, Reliability and
Integrity, Sensitive Data, Inference Attacks, Multilevel Database Security
6 Web security 6
6.1 Web Security Considerations, User Authentication and Session
Management, Cookies, SSL, HTTPS, SSH, Web Browser Attacks,
WebBugs, Clickjacking, CrossSite Request Forgery, Session Hijacking and
Management, Phishing Technique, DNS Attack, Secure Electronic
Transaction, Email Attacks, Firewalls, Penetration Testing

"""

BDA_SYLLABUS = """

Course Outcomes:
1 Understand the key issues in big data management and its associated applications for
business decisions and strategy.
2
Demonstrate an ability to use frameworks like Hadoop, NOSQL and paradigms like
MapReduce to efficiently store retrieve and perform data Intensive activities for Big Data
Analytics.
3 Design and implement algorithms to analyze Big data, like Data streams, Web Data.
4 Understand the architecture and functioning of Gen AI models
5 Demonstrate a deep understanding of LLMs and fine-tuning, enabling them to apply these skills in
practical scenarios
6 Discuss ethical and societal implications of using Gen AI models.


Syllabus:
1 Introduction to Big Data 3
1.1 Introduction to Big Data, Big Data characteristics, Structured, SemiStructured and Non-Structured Data. Big Data Challenges, Examples of
Big Data in Real Life, Big Data Applications- Brief introduction to Data
Streams, Recommendation Systems, Social Networks, WWW.
2 Introduction to Big Data Frameworks: Hadoop, MapReduce 8
2.1
Need for a framework for Big Data Computing. Introduction to Hadoop.
Core Hadoop Components; Hadoop Ecosystem;
What is NoSQL? CAP Theorem, BASE characteristics for Databases;
NoSQL 4 data architecture patterns: Key-value stores, Graph stores,
Column family (Bigtable) stores, Document stores.
Introduction to Map Reduce: The Map Tasks, Grouping by Key, The
Reduce Tasks, Combiners, Partitioners,
Algorithms Using MapReduce:· Matrix-Vector Multiplication,
Relational-Algebra Operations - Computing Selections, Projections, Union,
Intersection, and Difference , Database operations - Computing Natural
Join, Group By and Aggregation, Matrix Multiplication with two and One
MapReduce Steps.
Illustrating benefits of MapReduce: Real life examples of databases and
applications
3 Mining Big data stream link analysis 8
3.1 The Stream Data Model: A Data stream management system, Examples
of Stream Sources,Stream Queries, Issues in Stream processing , sampling
data in a stream : sampling techniques. Filter streams: The bloom filter
Counting Distinct Elements in a Stream : The Count-Distinct Problem,
The Flajolet-Martin Algorithm, Counting Ones in a Window: The Cost
of Exact Counts, The Datar-Gionis-Indyk-Motwani Algorithm.
Link Analysis : Early Search Engines, Spam PageRank Definition,
Structure of the web, dead ends, Spider traps, Using Page rank in a
search engine, Efficient computation of Page Rank using matrices. link
Spam and spam Farm, HITS Algorithm.
4 Introduction to Generative AI 6
4.1 Overview of General AI and its significance;
Historical context and evolution of AI models. Introduction to Gen AI
models like ChatGPT, Gemini, CoPilot. Key concepts and terminology;
Architecture and Capabilities. Training processes and data requirements
Comparison with other AI models Demonstration of capabilities through
examples
5 Large Language Models 8
5.1
Understanding LLMs: Architecture and Components Training LLMs: Data,
computation, and algorithms Practical applications of LLMs Introduction to
fine-tuning pre-trained models- Transfer Learning and Fine-Tuning:
Overview of fine tuning techniques – Supervised, PEFT. Introduction
Retrieval Augmented Generations
6 Prompt Engineering Applications And Ethical Considerations 6
6.1
Basics of prompt engineering Designing effective prompts for different tasks
Prompting Techniques- Zero Shot, One-shot, Few Shot, Chain of thought.
Ethical considerations in Gen AI deployment- Bias and fairness, Privacy
concerns and data security Use cases in healthcare, finance, customer service,
and other domains.

"""