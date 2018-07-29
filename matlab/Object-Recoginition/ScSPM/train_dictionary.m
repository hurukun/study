function dic=train_dictionary(featureInfo)
% train dictionary with AP algorithm
    clabel = unique(featureInfo.label);
    num_class = length(clabel);
    num_img = length(featureInfo.label); % num of images

    load(featureInfo.path{1});
    dimFea = size(feaSet.feaArr, 1);
    predic_cluster_cnt=num_class*300;
    dic=zeros(dimFea,predic_cluster_cnt);
    class_ind=featureInfo.label(1);
    cluster_cnt=0;
    for ii = 1:num_class,
        perclass=find(featureInfo.label==class_ind);
        rand_indx=randperm(size(perclass,1));
        tr_img_cnt=min([uint16(size(perclass,1)/2) 25]);
        rand_indx=rand_indx(1:tr_img_cnt);
        predic_cnt=tr_img_cnt*80;
        class_fea=zeros(dimFea,predic_cnt);
        fea_cnt=0;
        fprintf(1,'Deal with images in class %d\n',ii);
        for ij=1:tr_img_cnt
            fpath = featureInfo.path{rand_indx(ij)};
            load(fpath);% load SIFT feature for each image.
            [idx,netsim,dpsim,expref]=AP(feaSet.feaArr');
            idx=unique(idx);
            fprintf(1,'Image: %d, cluster count: %d\n',ij,size(idx,1));
           % featTmp=feaSet.feaArr(:,idx);
            class_fea(:,fea_cnt+1:fea_cnt+size(idx,1))=feaSet.feaArr(:,idx);
            fea_cnt=fea_cnt+size(idx,1);
        end
        if fea_cnt+1<predic_cnt
            class_fea(:,fea_cnt+1:predic_cnt)=[];
        end
        fprintf(1,'Class %d feature count: %d\n',ii,fea_cnt);
        [idx,netsim,dpsim,expref]=AP(class_fea');
        idx=unique(idx);
        fprintf(1,'Class %d cluster count: %d\n',ii,size(idx,1));
        dic(:,cluster_cnt+1:cluster_cnt+size(idx,1))=class_fea(:,idx);
        cluster_cnt=cluster_cnt+size(idx,1);
    end;
    if cluster_cnt+1<predic_cluster_cnt
            dic(:,cluster_cnt+1:predic_cluster_cnt)=[];
    end
return;