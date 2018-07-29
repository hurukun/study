function [W,touying,touyingClass,aver]=PCA(X,Class,dimen)

% 输入样本按列堆积的矩阵X，以及每一列的所属的类别向量XClass，根据判据Judge提取特征。
%PCA求得并选取p个总体散度矩阵St的特征向量组成Eigen脸W，使得保留90%的能量。

% Sb是样本X的类间散度矩阵，Sw是样本X的类内散度矩阵。Class(i)是样本X(:,i)的类别。
% 并返回每类样本在W上的投影系数touying
% touying(:,i)所属的类别为touyingClass(i)。
% 返回该投影系数是因为一般来说会用每类样本各自取平均在W上投影作为一类样本的特征。



%以下为计算各类的均值,也就是average
%-------------------------------------------------------
samplecount=size(X,2);

sum1=1;%类别数
averclass(1)=Class(1);
aver(:,1)=X(:,1);
sum2(1)=1;

for i=2:samplecount
  signal=0;
        for k=1:sum1
          if Class(i)==averclass(k) %如果已经存在，就直接将这类的值进行相加
                       signal=1;
                   end
               end
           if signal==1
                   aver(:,sum1)=aver(:,sum1)+X(:,i);
                    sum2(sum1)=sum2(sum1)+1;
            else  %如果不存在，就加一类，将值进行相加
            sum1=sum1+1;
            averclass(sum1)=Class(i);
            aver(:,sum1)=0;
            sum2(sum1)=0;
            aver(:,sum1)=aver(:,sum1)+X(:,i); % 第ClassCount类的样本总和
            sum2(sum1)=sum2(sum1)+1; %第ClassCount类的样本数量
       end            
    end
    % 每一类分别除去各自的数量得到每一类的均值
for i=1:sum1
   aver(:,i) = aver(:,i) /sum2(i);
end;        
%-------------------------------------------------------
% 总体均值,也即计算每列的均值
m = mean(X,2); %n*1

% 总体散度矩阵： nxn 维
Xt = X - kron(m,ones(1,samplecount));

Xc = Xt;  % Xc：nxN 用总体散度矩阵St作产生矩阵

% Rc的维数： (nxN)' * nxN = NxN （n是样本的维数，N是样本总数XCount）
% Rc的维数： (nxK)' * nxK = KxK （n是样本的维数，K是样本类别数）
Rc = Xc'*Xc; 

% 求解Rc=Xc'*Xc的特征向量Vc，特征值Dc
[Vc,Dc] = eig(Rc); % Rc*Vc = Vc*Dc

% 按St的特征值从大到小排序

% 对角向量,即特征值
DcCol = diag(Dc);

% 从小到大排序
[DcSort,DcIndex] = sort(DcCol);

% Vc的列数
VcCols = size(Vc,2);

% 反序
for (i=1:VcCols)
    VcSort(:,i) = Vc(:,DcIndex(VcCols-i+1));
    DcSort(i) = DcCol(DcIndex(VcCols-i+1));
end

% 降维，保持90％的能量
%   DcSum = sum(DcSort);
 %   DcSum_extract = 0;
%    p = 0;

%    while( p < dimen)
  %      p = p + 1;
 %       DcSum_extract = sum(DcSort(1:p));
 %   end
% Wpca是由前p个最大的非0特征值对应的特征向量组成的，根据SVD定理从Vt计算得到。维数为 nxp
i=1;
while (i<=dimen&& DcSort(i)>0)
    Wpca(:,i) = DcSort(i)^(-1/2) * Xc * VcSort(:,i); 
    i = i + 1;
end
    W = Wpca;
 % 所有训练样本都在特征脸上投影，每一列的系数代表每一个样本的特征
touying = W'*X;  % 维数： (nxL)' * nxN = LxN
touyingClass = Class;

