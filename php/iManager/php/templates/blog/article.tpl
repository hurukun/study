{{*显示 一篇 blog*}}

{{extends file="layout/base_one_colume.tpl"}}
{{block name="main_panel"}}
                <div style="height:20px;"></div>
                <div class="article">
                    {{if $author and $author.edit == true }}
                        {{include file="blog/publisher.tpl"}}
                    {{else}}
                    <div class="artTitle tac">{{$article.title}}</div>
                    <div class="pubInfo tac">
                        <time>{{$article.time}}</time>
                        <span>{{$article.author}}</span>
                    </div>
                    <div class= "itemFooter hTabList" style="margin:5px 5px;">
                        <ul class="fr comList">
                            {{foreach $article.classes as $keyword}}
                            <li><a href="#" data-tid="{{$keyword.id}}">{{$keyword.content}}</a></li>
                            {{/foreach}}
                        </ul>
                        <div class="c"></div>
                    </div>
                    <div class="ww">
                       {{$article.content}}
                    </div>
                    {{/if}}
                    <div class="artAppend"></div>
                    <div class="cmtWrapper">
                        <h3>这里是评论</h3>
                        <div class="cmtList">
                            <ul>
                                {{foreach $article.comments as $comment}}
                                <li>
                                    <div class="cmter p10 bgGray">
                                        <span>{{$comment.user}} 评论道</span>
                                        <time class="fr mr10">{{$comment.time}}</time>
                                    </div>
                                    <div class="cmtItem p10">
                                        {{$comment.content}}
                                    </div>
                                </li>
                                {{/foreach}}
                            </ul>
                        </div>
                        <div class="cmtPublisher">
                            <div class="pubCmt">
                                <div>
                                    <label>昵称</label>
                                    <input class="mr5" type="text" data-type="auther"/>
                                    <label>联系方式</label>
                                    <input class="mr5" type="text" data-type="contact"/>
                                </div>
                                <div class="mt10">
                                    <label class="b mb5">内容</label>
                                    <div class="taCmt" contenteditable="true" data-type="content"></div>
                                </div>
                                <div>
                                    <button class="pubBtn" data-type="pubBtn"><span>发表</span></button>
                                </div>
                            </div>
                        </div><!-- .cmtPublisher -->
                    </div> <!-- .cmtWrapper -->
                </div> <!-- .article -->
{{/block}}
