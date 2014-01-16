{%$FE_GBVAR=[
    'aladdin_txt' => '',
    'wrapper_prefix' => '<tr><td class="f">',
    'wrapper_suffix' => '</td></tr>',
    'url_encryption' => "{%$templateConfig.URLEncryption=="1"%}",
    'encrypt_prefix' => "{%$templateConfig.urlEncryption_jump%}",
    'urlEncMaxLen' => ($templateConfig.urlEncMaxLen)?((int)$templateConfig.urlEncMaxLen):2000
]%}

{%$baiduId=$queryInfo.baiduId%}
{%$serverTime=$queryInfo.listTime%}
{%$productEncKey=$queryInfo.productEncKey%}

{%$resToken=[]%}
{%$resToken["tieba"]=($templateConfig.token_tieba=="1")%}
{%$resToken["baike"]=($templateConfig.token_baike=="1")%}

{%function name=fe_fn_make_url%}{%strip%}
    {%(strlen($eurl)>0 && strlen($eurl)<$FE_GBVAR.urlEncMaxLen)?"`$FE_GBVAR.encrypt_prefix``$eurl`":"`$ourl`"%}
{%/strip%}{%/function%}

{%function name=fe_fn_enc_url%}{%strip%}
{%if $FE_GBVAR.url_encryption%}
    {%if $token && $resToken[$token]%}
        {%$urlTokenMd5Str = "`$url``$serverTime`"%}
        {%$urlTokenMd5 = md5($urlTokenMd5Str)%}
        {%$urlToken = "`$urlTokenMd5`&`$serverTime`"%}
        {%if strlen($urlToken)>0 && strlen($urlToken)<$FE_GBVAR.urlEncMaxLen%}
            {%$url = "`$url`&__bd_tkn__=`$urlToken`"%}
        {%/if%}
        {%fe_fn_make_url eurl=$url ourl=$url%}
    {%elseif $backEndEncryption%}
        {%$url%}
    {%else%}
        {%fe_fn_make_url eurl=$url ourl=$url%}
    {%/if%}
{%else%}
    {%$url%}
{%/if%}
{%/strip%}{%/function%}

{%function fe_fn_showurl showurl='' date='' showlamp=''%}
<span style="color:#008000">{%$showurl|escape:'html'%} {%if $date%} {%$date|escape:'html'%} {%/if%}</span>{%if $showlamp%} - <a target="_blank" href="http://open.baidu.com/" class="op_LAMP"></a>{%/if%}
{%/function%} 

{%function fe_fn_title_soucang title='' url='' token='' backEndEncryption=''%}<span class="tsuf tsuf-op" data="{title : '{%$title|escape:'javascript'%}', link : '{%fe_fn_enc_url url="`$url|escape:'javascript'`" token="`$token`" backEndEncryption="`$backEndEncryption`"%}'}"></span>{%/function%}

{%function fe_fn_title title='' url='' token='' backEndEncryption='' highlightParam=0%}
    <a href="{%fe_fn_enc_url url="`$url`" token="`$token`" backEndEncryption="`$backEndEncryption`"%}" target="_blank">{%$title|highlight:{%$highlightParam%}%}</a>
{%/function%}

{%function fe_fn_title_url url='' token='' backEndEncryption=''%}{%fe_fn_enc_url url="`$url`" token="`$token`" backEndEncryption="`$backEndEncryption`"%}{%/function%}

{%function fe_fn_title_prefix%}<h3 class="t">{%/function%}

{%function fe_fn_title_suffix title='' url='' token='' backEndEncryption=''%}{%fe_fn_title_soucang title="{%$title%}" url="{%$url%}" token="`$token`" backEndEncryption="`$backEndEncryption`"%}</h3>{%/function%}

{%function fe_fn_title_suffix2%}</h3>{%/function%}

{%function fe_fn_likeshare%}
{%if $tplData.showLikeShare%}<span class="opui-likeshare-{%$extData.resourceid%} opui-likeshare-l_box" data-ls="{share:'1',rid:'{%$extData.resourceid%}',mid:'{%if $tplData.moduleid%}{%$tplData.moduleid%}{%/if%}',query:'{%$extData.OriginQuery|escape:'javascript'%}',key:'{%$extData.fetchkey|escape:'javascript'%}',url:'{%$tplData.url|escape:'javascript'%}',image:'{%if $tplData.shareImage%}on{%/if%}'}"></span><script>A.use('likeshare3')</script><script>A.ui.likeshare({%$extData.resourceid%})</script>{%/if%}
{%/function%}

{%function fe_fn_addtohome%}{%/function%}

{%block name="main_container"%}
{%$wrapByAladdin=(isset($extData.feData.wrapByAladdin) && $extData.feData.wrapByAladdin==true)%}
{%if $wrapByAladdin%}<table data-table=1 style="margin-bottom:18px;" class="result-op" cellpadding="0" cellspacing="0" {%if $extData.resourceid && $extData.resourceid gt 5999%} srcid="{%$extData.resourceid%}" fk="{%$extData.fetchkey|escape%}"{%/if%} id="{%$extData.feData.id%}" mu="{%$extData.feData.mu%}" data-op="{'y':'{%$extData.feData.y%}'}">{%/if%}
{%block name="content"%}{%/block%}
{%if $wrapByAladdin%}</table>{%/if%}
{%/block%}
