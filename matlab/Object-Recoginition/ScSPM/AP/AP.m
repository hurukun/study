function [idx,netsim,dpsim,expref]=AP(X)
% use AP algorithm to cluster the data.
% X is the data matrix to be clustered. Each row is a data vector.

    % calculate the Pairwise distance of data vectors,get the S matrix.
    Y=pdist(X);
    S=squareform(Y);
    S=-S.^2;
    % get the P maxtrix.
    S=S-diag(diag(S));
    P=mean(S);
    % call the AP algorithm to cluster the data.
    [idx,netsim,dpsim,expref]=apcluster(S,P);
return