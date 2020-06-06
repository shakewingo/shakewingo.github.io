---
layout: post
mathjax: true
title: Gradient Descent vs Ordinary Least Square
categories: Mathematics and statistics
---

## Introduction
Gradient descent is a popular method applied almost everywhere in machine learning. But back to the period 
that traditional mathematics rules the world, ordinary least square is the fundamental of 
solving simple linear problem. Therefore, my motivation of writing this blog is to figure out the 
similarity and difference of these two methods.

Hopefully after this, we will have better understanding on the aspect of both theory and experiments.

## Theory
While I was reviewing [Machine Learning by Andrew Ng](https://www.youtube.com/playlist?list=PLLssT5z_DsK-h9vYZkQkYNWcItqhlRJLN),
the course skipped the proof part of OLS, by default thinking that we have sufficient matrix knowledge (do we? lol).
So, I'd like to include the proof here.

First, let's introduce some terminologies and notations. Consider a multiple linear regression:

\\[h_{\boldsymbol \theta}(\boldsymbol x^{(i)}) = \theta_1 x_1^{(i)} + \theta_2 x_2^{(i)}  + ... + \theta_n x_n^{(i)} 
= \boldsymbol \theta^T \boldsymbol x^{(i)} = {\boldsymbol x^{(i)}}^T \boldsymbol \theta \\]
where 
$\boldsymbol \theta = \begin{bmatrix} \theta_1 \\\ \theta_2 \\\ \vdots \\\ \theta_n \end{bmatrix}$，
$\boldsymbol x^{(i)} = \begin{bmatrix} x_1^{(i)} \\\ x_2^{(i)} \\\ \vdots \\\ x_n^{(i)} \end{bmatrix}$，
$\boldsymbol y = \begin{bmatrix} y_1 \\\ y_2 \\\ \vdots \\\ y_n \end{bmatrix}$

$\boldsymbol y$ is the target，$h_{\boldsymbol \theta}(\boldsymbol x^{(i)})$ is the hypothesis function,
$m$ is number of training samples / observations, $n$ is number of features for multiple linear regression,
e.g. $\boldsymbol x^{(i)}$ is the ith training sample, $x_j^{(i)}$ is the jth feature value of ith training sample.

Given the cost function:
\\[J(\boldsymbol \theta) = \frac{1}{2m} \sum_{i=1}^m (h_{\boldsymbol \theta}(\boldsymbol x^{(i)}) - y_i)^2\\]

The objective is to estimate parameters $\boldsymbol \theta$, so that hypothesis function can have the minimum cost.


### Gradient Descent
Since the cost function will be a convex bowl-shaped graph, let's use a 2-dimension projection between $J$ and $\theta_i$
to explain how the algorithm works.

2-dimension projection looks like:
![cost function plot](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")








### OLS
Have $\sum_{i=1}^m (h_{\boldsymbol \theta}(\boldsymbol x^{(i)}) - y_i)^2 
= \begin{bmatrix} h_{\boldsymbol \theta}(\boldsymbol x^{(1)}) - y_1 \\ \dots\\ h_{\boldsymbol \theta}(\boldsymbol x^{(m)}) - y_m \end{bmatrix}
\times \begin{bmatrix} h_{\boldsymbol \theta}(\boldsymbol x^{(1)}) - y_1 \\\ \vdots\\\ h_{\boldsymbol \theta}(\boldsymbol x^{(m)}) - y_m \end{bmatrix}$ 
$= \begin{bmatrix} \boldsymbol \theta^T \boldsymbol x^{(1)} - y_1 \\ \dots\\ \boldsymbol \theta^T \boldsymbol x^{(m)} - y_m \end{bmatrix}
\times \begin{bmatrix} \boldsymbol \theta^T \boldsymbol x^{(1)} - y_1 \\\ \vdots\\\ \boldsymbol \theta^T \boldsymbol x^{(m)} - y_m \end{bmatrix}$

Also have $\begin{bmatrix} \boldsymbol \theta^T \boldsymbol x^{(1)} - y_1 \\\ \vdots\\\ \boldsymbol \theta^T \boldsymbol x^{(m)} - y_m \end{bmatrix}
=\begin{bmatrix} \boldsymbol \theta^T \boldsymbol x^{(1)} \\\ \vdots\\\ \boldsymbol \theta^T \boldsymbol x^{(m)} \end{bmatrix} - \boldsymbol y
=\begin{bmatrix} {\boldsymbol x^{(1)}}^T \boldsymbol \theta \\\ \vdots\\\ {\boldsymbol x^{(m)}}^T \boldsymbol \theta \end{bmatrix} - \boldsymbol y 
= \boldsymbol X \boldsymbol \theta - \boldsymbol y$

where $\boldsymbol X = \begin{bmatrix} {\boldsymbol x^{(1)}}^T \\\ \vdots\\\ {\boldsymbol x^{(m)}}^T \end{bmatrix}
= \begin{bmatrix}x_1^{(1)} & x_2^{(1)} & \dots & x_n^{(1)}\\\ \vdots\\\ x_1^{(m)} & x_2^{(m)} & \dots & x_n^{(m)}\end{bmatrix}_{m \times n}$

Therefore have:

$$ \sum_{i=1}^m (h_{\boldsymbol \theta}(\boldsymbol x^{(i)}) - y_i)^2 = 
(\boldsymbol X \boldsymbol \theta - \boldsymbol y)^T (\boldsymbol X \boldsymbol \theta - \boldsymbol y) $$

Regardless $\frac{1}{2m}$, the cost function then can be simplified as:

$$ J(\boldsymbol \theta) = (\boldsymbol X \boldsymbol \theta - \boldsymbol y)^T (\boldsymbol X \boldsymbol \theta - \boldsymbol y) $$

$$ J(\boldsymbol \theta) = ((\boldsymbol X \boldsymbol \theta)^T - {\boldsymbol y}^T) (\boldsymbol X \boldsymbol \theta - \boldsymbol y)
= {\boldsymbol \theta}^T {\boldsymbol X}^T \boldsymbol X \boldsymbol \theta - 
(\boldsymbol X \boldsymbol \theta)^T  \boldsymbol y -
{\boldsymbol y}^T \boldsymbol X \boldsymbol \theta + 
{\boldsymbol y}^T \boldsymbol y $$

Note that $(\boldsymbol X \boldsymbol \theta)^T  \boldsymbol y= {\boldsymbol y}^T \boldsymbol X \boldsymbol \theta$,
because both $\boldsymbol X \boldsymbol \theta$ and $\boldsymbol y$ are vectors and have the same dimensions, 
so the order to multiply does not matter.

Then:

$$ J(\boldsymbol \theta) = {\boldsymbol \theta}^T {\boldsymbol X}^T \boldsymbol X \boldsymbol \theta - 
2 (\boldsymbol X \boldsymbol \theta)^T  \boldsymbol y +
{\boldsymbol y}^T \boldsymbol y $$

Therefore to get the minimum cost, calculate derivatives:
 
$$ \frac{\partial J}{\partial \boldsymbol \theta}
= \frac {\partial  ({\boldsymbol \theta}^T {\boldsymbol X}^T \boldsymbol X \boldsymbol \theta - 
2 (\boldsymbol X \boldsymbol \theta)^T  \boldsymbol y +
{\boldsymbol y}^T \boldsymbol y)}{\partial \boldsymbol \theta} 
= \frac {\partial ({\boldsymbol \theta}^T {\boldsymbol X}^T \boldsymbol X \boldsymbol \theta)}{\partial \boldsymbol \theta} - 
\frac {\partial (2 (\boldsymbol X \boldsymbol \theta)^T  \boldsymbol y)}{\partial \boldsymbol \theta}
= \frac {({\boldsymbol X}^T \boldsymbol X) \partial ({\boldsymbol \theta}^T \boldsymbol \theta)}{\partial \boldsymbol \theta} - 
\frac {2 (\boldsymbol X \boldsymbol y) \partial {\boldsymbol \theta}^T }{\partial \boldsymbol \theta} = 0 $$

where $ \boldsymbol X$ and $\boldsymbol y$ are constants.

Furthermore, recall [matrix calculus](https://en.wikipedia.org/wiki/Matrix_calculus) can infer that:
$$ \partial {\boldsymbol \theta}^T \boldsymbol \theta = 2 \boldsymbol \theta,  
\partial {\boldsymbol \theta}^T  = {(\partial \boldsymbol \theta)}^T = 1 $$

Therefore we have:

$$ \frac{\partial J}{\partial \boldsymbol \theta} = 2 {\boldsymbol X}^T \boldsymbol X \boldsymbol \theta -
2 {\boldsymbol X}^T \boldsymbol y \boldsymbol= 0 $$

Finally, obtain the normal equation as:

$$ \boldsymbol \theta = ({\boldsymbol X}^T {\boldsymbol X})^{-1} {\boldsymbol X}^T \boldsymbol y $$

## Experiments

## Similarity and difference































