function [X,Y] = histogram( I )
    [m n]=size(I);
    X=zeros(1,n);
    % 求垂直投影
    for y=1:n
         X(y)=sum(I(:,y));
    end
    y=1:n;
    figure
    subplot(211),plot(y,X(y));
    title('垂直投影');

    Y=zeros(1,m);
    % 求水平投影
    for x=1:m
        Y(x)=sum(I(x,:));
    end
    x=1:m;
    subplot(212),plot(x,Y(x));
    title('水平投影');
end
