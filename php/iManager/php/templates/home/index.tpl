{{* 首页 *}}
{{extends file="layout/base_one_colume.tpl"}}

{{block name="main_panel"}}
<div id="calender">
                <ul>
                    <li class="calCard">
                        <div class="calDate">
                            <span class="calMonth">12</span>月<span class="calDay">3</span>日
                        </div>
                        <div class="calEvent">
                        </div>
                    </li>
                </ul>
            </div>
            <div id="apps">
                <button id="mainPagePrev" class="pageSwitcher" style="left:10px;">&lt;</button>
                <div id="appPages">
                    <ul id="appList">
                        <li class="appPage">
                            <div class="app">
                                <a href="./blog/" class="appIcon b" title="无限未知">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Blog</p>
                            </div>
                            <div class="app">
                                <a href="./iblog/" class="appIcon b" title="无限未知">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">iBlog</p>
                            </div>
                            <div class="app">
                                <a href="./diary/" class="appIcon b" title="记忆长河">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Diary</p>
                            </div>
                            <div class="app">
                                <a href="./affairs/" class="appIcon b" title="预见未来">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Affairs</p>
                            </div>
                            <div class="app">
                                <a href="./contacts/" class="appIcon b" title="实验田">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Contacts</p>
                            </div>
                            <div class="app">
                                <a href="./example/" class="appIcon b" title="实验田">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Examples</p>
                            </div>
                            <div class="c"></div>
                        </li>
                        </li>
                        <li class="appPage">
                            <div class="app">
                                <a href="./blog/admin/" class="appIcon b" title="知识入库">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Blog Admin</p>
                            </div>
                            <div class="app">
                                <a href="./motto/admin" class="appIcon b" title="智慧真言">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Motto</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <button id="mainPageNext" class="pageSwitcher" style="right:10px;">&gt;</button>
            </div>
{{/block}}
