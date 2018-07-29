function [xLow] = portraitBorder( I, xHist )
    [m n]=size(I);
    xLow = 0;
    
    histMax = max(xHist);
    % �� 3/4 λ����ǰ�� hist ���ֵ
    for x= floor(3*n/4):-1:floor(1*n/2)
        if( xLow == 0 && xHist(x) == histMax )
            xLow = x;
            break;
        end
    end
    
    Inew = zeros( m, xLow  );
    for x = 1: xLow
        Inew( :,x ) = I(:,x );
    end

    imshow( Inew );
end