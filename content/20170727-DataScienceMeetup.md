Title: Data Science Meetup: Delirium Detection With CNNs
Date: 2017-07-26
Category: log
Tags: log, eeg, cnn, nnet

Introduction
============

Noel Burton-Krahn


Delirium Detection in EEGs
==========================

Got baseStudyEDF: control and delerium EEGs
Total Control: 27
Total Delirium: 25

![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/baseStudyEDF.png)

Neural Networks
===============

Images from [CS231n Convolutional Neural Networks for Visual Recognition](http://cs231n.github.io/convolutional-networks/)

![neural_net2]({filename}/static/20170727-DataScienceMeetup/neural_net2.jpeg)

![cnn]({filename}/static/20170727-DataScienceMeetup/cnn.jpeg)

Convolutional Networks
----------------------

![convnet]({filename}/static/20170727-DataScienceMeetup/convnet.jpeg)

![weights]({filename}/static/20170727-DataScienceMeetup/weights.jpeg)


Deep Neural Networks
--------------------

![AlexNet]({filename}/static/20170727-DataScienceMeetup/Figure-27-CNN-Architecture-from-AlexNet-32.jpg)

![inception]({filename}/static/20170727-DataScienceMeetup/inception.png)


Demo Digit Classifier
---------------------

[2D Visualization of a CNN](http://scs.ryerson.ca/~aharley/vis/conv/flat.html) by A Harley, Ryerson


https://vimeo.com/125940125


A CNN for Delirium Detection
============================

Made 4*CONV + 2*FC CNN: avg*2, 64x8, 32x8, 16x8, 8x4, 64, 64, 1

in Python's Keras
```
    Input(inputs.shape[1:])
    AveragePooling1D(pool_size=2)
    Conv1D(64, 8, activation='relu')
    MaxPooling1D()
    Conv1D(32, 8, activation='relu')
    MaxPooling1D()
    Conv1D(16, 8, activation='relu')
    MaxPooling1D()
    Conv1D(2, 8, activation='relu')
    MaxPooling1D(8)
    Flatten()
    Dense(64, activation='sigmoid',
          kernel_regularizer=regularizers.l2(0.01),
          activity_regularizer=regularizers.l1(0.01),
          )
    Dense(64, activation='sigmoid')
    Dense(1, activation='sigmoid')
```

![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/model.png)


Training
--------

Trained on 3 splits: train on 66% of data, evaluate on 33% untrained
data.  Average accuracy: (94 + 100 + 82)/3 = 92%

![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/split0.png)
![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/split1.png)
![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/split2.png)


The training graphs demonstrate:

* 92% accuracy on untrained validation data is pretty good

* The training dataset is too small.  When the training accuracy goes
  to 100%, the net is overfitted to the data.

![split0.gif]({filename}/static/20170727-DataScienceMeetup/model-split0.gif)
![split1.gif]({filename}/static/20170727-DataScienceMeetup/model-split1.gif)
![split2.gif]({filename}/static/20170727-DataScienceMeetup/model-split2.gif)


CNNs are easily Fooled
=======================

[Attacking Machine Learning with Adversarial Examples](https://blog.openai.com/adversarial-example-research/)

![blackbox]({filename}/static/20170727-DataScienceMeetup/adversarial_img_1.png)


[Deep Neural Network are Easily Fooled: High Confidence Predictions for Unrecognizable Images](http://anhnguyen.me/project/fooling/)

![blackbox]({filename}/static/20170727-DataScienceMeetup/diversity_40_images_label.png)


The Black Box Problem
---------------------

![blackbox]({filename}/static/20170727-DataScienceMeetup/blackbox.jpg)

Medical device approval requires justification.


FDA Approval is Possible
-------------------------

Despite the challenges, devices based on neural networks have recently
been granted FDA approval, and there are many startups emerging in
this space.

* [Arterys Receives FDA Clearance For The First Zero-Footprint Medical Imaging Analytics Cloud Software With Deep Learning For Cardiac MRI](
  http://www.prnewswire.com/news-releases/arterys-receives-fda-clearance-for-the-first-zero-footprint-medical-imaging-analytics-cloud-software-with-deep-learning-for-cardiac-mri-300387880.html)

* [Arterys nabs second FDA OK for deep learning, image analysis software](
  http://www.fiercebiotech.com/medical-devices/arterys-nabs-second-fda-ok-for-deep-learning-image-analysis-software)

* [9 Artificial Intelligence Startups in Medical Imaging](
  https://www.google.ca/amp/www.nanalyze.com/2017/02/artificial-intelligence-medical-imaging/amp/)


CNN Analysis
============

Did deeper analysis of the CNN convolution filters.  Convolution
filters are similar to wavelets in that they perform a multiscale
correlation of the input signal with learned feature fragments.  Lower
layers convolve with the outputs of upper layers to match larger scale
features.

These graphs show the input feature that maximizes neuron excitment
for each convolution filtter at each level.

The final correlation layer's output is passed through a
fully-connected network for final classification.


![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/model-split0-epoch28-val_acc0.94.hdf5-layer1.png)
![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/model-split0-epoch28-val_acc0.94.hdf5-layer4.png)
![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/model-split0-epoch28-val_acc0.94.hdf5-layer7.png)
![baseStudyEDF]({filename}/static/20170727-DataScienceMeetup/model-split0-epoch28-val_acc0.94.hdf5-layer10.png)
   

Other ways of looking at EEGS
=============================

Frequency spectrogram
---------------------

Spectrograms of 8 delirium and 8 control EEGs

![eeg-spectrogram.png]({filename}/static/20170727-DataScienceMeetup/eeg-spectrogram.png)


Wavelet transform
-----------------

Problem: The DWT is shift-variant

Solution?  The [The Dual-Tree Complex Wavelet Transform](
http://people.math.sc.edu/blanco/imi/dtcwt0.pdf) is shift-invariant

[Python dtcwt](https://pypi.python.org/pypi/dtcwt/)

Here's the DTCWT vs the DWT for a control EEG

![dtcwt-dwt-control1.png]({filename}/static/20170727-DataScienceMeetup/dtcwt-dwt-control1.png)

And the DTCWT for a control vs delirium EEG

![dtcwt1-control-delirum.png]({filename}/static/20170727-DataScienceMeetup/dtcwt1-control-delirum.png)


Examining 8sec DWT samples grouped by patient, ordered by validate_acc
during training.  Each 8sec dwt block was used as a validation point
in 3 keras training runs, and sorted by average accuracy.  The results
were tabulated in a Jupyter notebook which could overlay blocks
interacively for visual comparison.

The most consistently accurate delirium blocks appeared to have high
frequency oscillations around coeffs 90-128.  Also sometimes high
amplitudes in the 1-64 coeff range.

The most consistently accurate control blocks has low frequency
oscillations around coeffs 90-128, and low amplitudes overall.

There were exceptions to these rules that were nevertheless
consistently accurate.

  ![jupyter_validate_acc]({filename}/static/20170727-DataScienceMeetup/jupyter_validate_acc.png)


Continuous wavelet transform of 8sec delirium eeg
-------------------------------------------------

From noel/classifiers/CWTTest.ipynb

![dwt-cwt]({filename}/static/20170727-DataScienceMeetup/20170519-cwt.png)


Trying CNN on Wavelet transform
-------------------------------

Goal: to find a wavelet basis that isolates the delirium features.

Found: dtcwt scales 6-8, (8Hz, 4Hz, 2Hz, 896 points per sample, from
32k), fc16, fc16 nnet: 98.1%

<video width="720" height="240" controls>
  <source src="{filename}/static/20170727-DataScienceMeetup/eeg-ddtcwt-nnet-coeffs4-5-fc16.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


Conclusions
===========

* Deep networks can produce high accuracy

* But they can be fooled, and the error resonse is unknown

* They need to be fully explained to satisfy regulatory requirements


Future Work
===========

* Maybe a CNN with smaller FC layers would be easier:  just convolutions, no fully-connected layers?

* Try in wavelet domain to reduce convolutional layers

* Try genetic algorithm for optimizing layers

