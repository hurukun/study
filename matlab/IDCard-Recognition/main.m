
clear all
clc
close all
%% ����ͼ������
I=imread('H:\sfz.jpg');
I=rgb2gray(I);
[m n]=size(I);

%% ͼ��Ԥ����
I = pretreatment( I );
imshow( I );

%% ֱ��ͼ
[X,Y] = histogram( I );

%% Ѱ�����֤�ŵ��ϱ߽�
[yLow] = codeBorder( I, Y );
%% ȥ�����֤��
for y = yLow: m
    I(y,:) = 255;
end
imshow( I );

%% ��ֱ��ͼ
[X,Y] = histogram( I );
%% ͷ��߽�
[xPortraitLow] = portraitBorder( I, X );