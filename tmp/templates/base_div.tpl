{%extends 'base.tpl'%}
{%block name="main_container"%}
{%$wrapByAladdin=(isset($extData.feData.wrapByAladdin) && $extData.feData.wrapByAladdin==true)%}
{%if $wrapByAladdin%}<div class="result-op" {%if $extData.resourceid && $extData.resourceid gt 5999%} srcid="{%$extData.resourceid%}" fk="{%$extData.fetchkey|escape%}"{%/if%} id="{%$extData.feData.id%}" mu="{%$extData.feData.mu%}" data-op="{'y':'{%$extData.feData.y%}'}">{%/if%}
{%block name="content"%}{%/block%}
{%if $wrapByAladdin%}</div><br>{%/if%}
{%/block%}
