# Non-latest Checkout of Choice Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsNonlatestCheckoutRules.html)  
> 获取日期：2026-11-12

<a id="wwID0EEDRR"></a>

<a id="wwID0EUDRR"></a>

You can check out and edit non-latest iterations of local choice rules that are associated with an option set. To do that, the preference Allow checkout of non-latest iterations must be set to Allow checkout of non-latest iterations.

<a id="wwID0EBERR"></a>

Consider the following use case. It is possible for different iterations (or versions) of an option set to be associated to the same local rule iteration. For example, if the option set iteration A.3 references the local rule A.2 and then the option set is revised to B.1, both option set revisions, A and B, will point to the same local rule A.2.

<a id="wwID0EGERR"></a>

Suppose a choice rule A.2 was edited from the option set B.2: this iterates the choice rule to A.3, and the option set to B.2. This does not affect the A.2 iteration of the choice rule that is associated with the option set A.3: you can still check out the A.2 choice rule and edit the rule.
