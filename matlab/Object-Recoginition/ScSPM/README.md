code of ScSPM algorithm for paper in school.

The algorithm is composed of the following parts:
a. SIFT descriptor extraction.
b. Sparse coding. We integrated Honglak Lee's matlab codes for training the dictionary. We provide a codebook trained on Caltech 101 for reference.
c. Multi-scale spatial max pooling of sparse codes.
d. Linear SVM classification. We implemented a simple linear SVM with squared hinge loss function. Other packages such as Liblinear are recommended.
