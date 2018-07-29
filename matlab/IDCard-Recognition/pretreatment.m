function In = pretreatment( I )
    [m n]=size(I);
    In = zeros(m,n);
    for x = 1:m
        for y = 1:n
            if( I(x,y) > 128 )
                In(x,y) = 255;
            else
                In(x,y) = 0;
            end
        end
    end
end