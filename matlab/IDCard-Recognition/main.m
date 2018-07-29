
clear all
clc
close all
%% 读入图像数据
I=imread('H:\sfz.jpg');
I=rgb2gray(I);
[m n]=size(I);

%% 图像预处理
I = pretreatment( I );
imshow( I );

%% 直方图
[X,Y] = histogram( I );

%% 寻找身份证号的上边界
[yLow] = codeBorder( I, Y );
%% 去除身份证号
for y = yLow: m
    I(y,:) = 255;
end
imshow( I );

%% 新直方图
[X,Y] = histogram( I );
%% 头像边界
[xPortraitLow] = portraitBorder( I, X );