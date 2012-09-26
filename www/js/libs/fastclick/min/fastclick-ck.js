/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENCE.txt)
 * @codingstandard ftlabs-jslint
 *//*jslint browser:true*//*global Node, define*/(function(){"use strict";function n(e){switch(e.nodeName.toLowerCase()){case"textarea":case"select":case"input":case"label":case"video":return!0;default:return/\bneedsclick\b/.test(e.className)}}function r(t,n){if(e&&window.devicePixelRatio){t*=window.devicePixelRatio;n*=window.devicePixelRatio}return document.elementFromPoint(t,n)}function i(e){var i,s={x:0,y:0,scrollX:0,scrollY:0},o=!1,u=Math.pow(37,2),a=function(e){o=!0;s.x=e.targetTouches[0].pageX;s.y=e.targetTouches[0].pageY;s.x===e.targetTouches[0].clientX&&(s.x+=window.pageXOffset);s.y===e.targetTouches[0].clientY&&(s.y+=window.pageYOffset);s.scrollX=window.pageXOffset;s.scrollY=window.pageYOffset;return!0},f=function(e){if(!o)return!0;Math.pow(e.targetTouches[0].pageX-s.x,2)+Math.pow(e.targetTouches[0].pageY-s.y,2)>u&&(o=!1);if(Math.abs(window.pageXOffset-s.scrollX)>t||Math.abs(window.pageYOffset-s.scrollY)>t)o=!1;return!0},l=function(e){var t,i,u;if(!o)return!0;o=!1;i={x:s.x-s.scrollX,y:s.y-s.scrollY};t=r(i.x,i.y);if(!t)return!1;t.nodeType===Node.TEXT_NODE&&(t=t.parentElement);if(n(t))return!1;u=document.createEvent("MouseEvents");u.initMouseEvent("click",!0,!0,window,1,0,0,i.x,i.y,!1,!1,!1,!1,0,null);u.forwardedTouchEvent=!0;t.dispatchEvent(u);e.preventDefault();return!1},c=function(){o=!1},h=function(e){var t;if(e.forwardedTouchEvent)return!0;if(!e.cancelable)return!0;t=r(s.x-s.scrollX,s.y-s.scrollY);if(!t||!n(t)){e.stopImmediatePropagation&&e.stopImmediatePropagation();e.stopPropagation();e.preventDefault();return!1}return!0};if(!e||!e.nodeType)throw new TypeError("Layer must be a document node");if(typeof window.ontouchstart=="undefined")return;e.addEventListener("click",h,!0);e.addEventListener("touchstart",a,!0);e.addEventListener("touchmove",f,!0);e.addEventListener("touchend",l,!0);e.addEventListener("touchcancel",c,!0);if(typeof e.onclick=="function"){i=e.onclick;e.addEventListener("click",function(e){i(e)},!1);e.onclick=null}}var e=/Android.+Chrome|CrMo/.test(navigator.userAgent),t=navigator.userAgent.indexOf("PlayBook")===-1?5:20;typeof define=="function"&&define.amd?define(function(){return i}):window.FastClick=i})();