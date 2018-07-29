function [X,Y] = histogram( I )
    [m n]=size(I);
    X=zeros(1,n);
    % ��ֱͶӰ
    for y=1:n
         X(y)=sum(I(:,y));
    end
    y=1:n;
    figure
    subplot(211),plot(y,X(y));
    title('��ֱͶӰ');

    Y=zeros(1,m);
    % ��ˮƽͶӰ
    for x=1:m
        Y(x)=sum(I(x,:));
    end
    x=1:m;
    subplot(212),plot(x,Y(x));
    title('ˮƽͶӰ');
end
