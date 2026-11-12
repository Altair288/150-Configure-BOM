# Managing Configurable Products

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[Managing Configurable Products](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsManageConfigProd.html)  
> 获取日期：2026-11-12  
> 图片：原文正文没有内嵌图片，只有页面工具栏图标，因此没有图片资源需要下载。  
> 备注：本地开发参考副本；如需再分发，请遵守 PTC 适用的使用条款。

To facilitate the Variant Design and Generation process, companies have adopted some common industry practices to manage their product information.

- **Modular product structure** — During the Generic Platform Design phase, the product is typically decomposed into modular sections to support specific functions or subsets of functions of the product. The designs and some modular sections of the product may be associated with more than one product.
- **Overloaded product structure** — To support a range of options in the product, some sections of the product structure contain multiple designs to satisfy specific capabilities needed for that function.
- **Option management** — To create an order of the product, a set of options and choices are defined to identify the product features that can vary within the product family.
  - The choices for each option are assigned to the designs in each overloaded section of the product. These choices determine which designs are selected when an order of the product is created.
  - Rules are created between the option choices to constrain when certain combinations of options can be selected in the product.
- **Order structure** — A part structure with no additional product options is created to reflect a sales order. The order structure is analyzed, tested, and validated.
