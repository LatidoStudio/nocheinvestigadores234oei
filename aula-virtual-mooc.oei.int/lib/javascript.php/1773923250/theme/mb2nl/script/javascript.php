/**
 *
 * @package   theme_mb2nl
 * @copyright 2017 - 2025 Mariusz Boloz (lmsstyle.com)
 * @license   PHP and HTML: http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later. Other parts: http://themeforest.net/licenses
 *
 */var mb2nl_helper=function(){return{dataAttribs:function(a){var t={};return $.each(a[0].attributes,function(){this.name.includes("data-")&&!this.name.includes("data-jarallax-")&&this.specified&&(t[this.name.replace("data-","")]=this.value)}),t}}}