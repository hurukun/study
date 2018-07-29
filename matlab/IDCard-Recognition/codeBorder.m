function [yLow] = codeBorder( I, yHist )
    [m n]=size(I);
    yLow = 0;
    
    % 从 3/4 位置往后找斜率变化大于 45 度
    for y= floor(3*m/4):m - 5
        if( yLow == 0 && yHist( y+5 ) - yHist( y ) <= -5 )
            yLow = y;
            break;
        end
    end
    
    Inew = zeros(m - yLow, n );
    for y = 1: m - yLow
        Inew( y,: ) = I(yLow + y,: );
    end

    imshow( Inew );
end