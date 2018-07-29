function draw_dist(X,label,dim)
%draw the distribution of X,
% all vectors in X are line vectors
% label is a row vector that mark the class label for each vetor in X
% dim means the dimension of the coordinate
    [W,Xt]=PCA(X,label,dim);
    color=['b' 'g' 'r' 'c' 'm' 'y' 'k'];
    shape=['*' 'x' 'o' 's' '.'];
    classNum=size(unique(label),2);
    
    c_ind=1;
    s_ind=1;
    for i=1:classNum
        point_ind=find(label==i);
        points=Xt(:,point_ind);
        if dim==2
            plot(points(1,:),points(2,:),[color(c_ind),shape(s_ind)]);
        elseif dim==3
            plot3(points(1,:),points(2,:),points(3,:),[color(c_ind),shape(s_ind)]);
        end
        c_ind=c_ind+1;
        if c_ind==size(color,2)+1
            break;
            c_ind=1;
            s_ind=s_ind+1;
            if s_ind==size(shape,2)+1
                break;
            end
        end
        hold on;
    end
return;


%%
function [W,touying,touyingClass,aver]=PCA(X,Class,dimen)

% �����������жѻ��ľ���X���Լ�ÿһ�е��������������XClass�������о�Judge��ȡ������
%PCA���ò�ѡȡp������ɢ�Ⱦ���St�������������Eigen�W��ʹ�ñ���90%�������

% Sb������X������ɢ�Ⱦ�����Sw������X������ɢ�Ⱦ�����Class(i)������X(:,i)��������
% ������ÿ��������W�ϵ�ͶӰϵ��touying
% touying(:,i)����������ΪtouyingClass(i)��
% ���ظ�ͶӰϵ������Ϊһ���˵����ÿ����������ȡƽ����W��ͶӰ��Ϊһ��������������



%����Ϊ���������ľ�ֵ,Ҳ����average
%-------------------------------------------------------
samplecount=size(X,2);

sum1=1;%������
averclass(1)=Class(1);
aver(:,1)=X(:,1);
sum2(1)=1;

for i=2:samplecount
  signal=0;
        for k=1:sum1
          if Class(i)==averclass(k) %�����Ѿ����ڣ���ֱ�ӽ�������ֵ��������
                       signal=1;
                   end
               end
           if signal==1
                   aver(:,sum1)=aver(:,sum1)+X(:,i);
                    sum2(sum1)=sum2(sum1)+1;
            else  %���������ڣ��ͼ�һ�࣬��ֵ��������
            sum1=sum1+1;
            averclass(sum1)=Class(i);
            aver(:,sum1)=0;
            sum2(sum1)=0;
            aver(:,sum1)=aver(:,sum1)+X(:,i); % ��ClassCount���������ܺ�
            sum2(sum1)=sum2(sum1)+1; %��ClassCount�����������
       end            
    end
    % ÿһ���ֱ���ȥ���Ե�����õ�ÿһ���ľ�ֵ
for i=1:sum1
   aver(:,i) = aver(:,i) /sum2(i);
end;        
%-------------------------------------------------------
% ������ֵ,Ҳ������ÿ�еľ�ֵ
m = mean(X,2); %n*1

% ����ɢ�Ⱦ����� nxn ά
Xt = X - kron(m,ones(1,samplecount));

Xc = Xt;  % Xc��nxN ������ɢ�Ⱦ���St����������

% Rc��ά���� (nxN)' * nxN = NxN ��n��������ά����N����������XCount��
% Rc��ά���� (nxK)' * nxK = KxK ��n��������ά����K��������������
Rc = Xc'*Xc; 

% ����Rc=Xc'*Xc���������Vc������ֵDc
[Vc,Dc] = eig(Rc); % Rc*Vc = Vc*Dc

% ��St������ֵ�Ӵ���С����

% �Խ����,������ֵ
DcCol = diag(Dc);

% ��С��������
[DcSort,DcIndex] = sort(DcCol);

% Vc������
VcCols = size(Vc,2);

% ����
for (i=1:VcCols)
    VcSort(:,i) = Vc(:,DcIndex(VcCols-i+1));
    DcSort(i) = DcCol(DcIndex(VcCols-i+1));
end

% ��ά������90�������
%   DcSum = sum(DcSort);
 %   DcSum_extract = 0;
%    p = 0;

%    while( p < dimen)
  %      p = p + 1;
 %       DcSum_extract = sum(DcSort(1:p));
 %   end
% Wpca����ǰp�������ķ�0����ֵ��Ӧ������������ɵģ�����SVD������Vt�����õ���ά��Ϊ nxp
i=1;
while (i<=dimen&& DcSort(i)>0)
    Wpca(:,i) = DcSort(i)^(-1/2) * Xc * VcSort(:,i); 
    i = i + 1;
end
    W = Wpca;
 % ����ѵ����������������ͶӰ��ÿһ�е�ϵ������ÿһ������������
touying = W'*X;  % ά���� (nxL)' * nxN = LxN
touyingClass = Class;

return;