jasmine.HtmlReporterHelpers={};jasmine.HtmlReporterHelpers.createDom=function(e,t,n){var r=document.createElement(e);for(var i=2;i<arguments.length;i++){var s=arguments[i];typeof s=="string"?r.appendChild(document.createTextNode(s)):s&&r.appendChild(s)}for(var o in t)o=="className"?r[o]=t[o]:r.setAttribute(o,t[o]);return r};jasmine.HtmlReporterHelpers.getSpecStatus=function(e){var t=e.results(),n=t.passed()?"passed":"failed";t.skipped&&(n="skipped");return n};jasmine.HtmlReporterHelpers.appendToSummary=function(e,t){var n=this.dom.summary,r=typeof e.parentSuite=="undefined"?"suite":"parentSuite",i=e[r];if(i){typeof this.views.suites[i.id]=="undefined"&&(this.views.suites[i.id]=new jasmine.HtmlReporter.SuiteView(i,this.dom,this.views));n=this.views.suites[i.id].element}n.appendChild(t)};jasmine.HtmlReporterHelpers.addHelpers=function(e){for(var t in jasmine.HtmlReporterHelpers)e.prototype[t]=jasmine.HtmlReporterHelpers[t]};jasmine.HtmlReporter=function(e){function s(){var e;(function(){if(e)return;var r=[],i=n.location.search.substring(1).split("&");for(var s=0;s<i.length;s++){var o=i[s].split("=");r[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}e=r.spec})();return e}function o(e){i.reporter=t.createDom("div",{id:"HTMLReporter",className:"jasmine_reporter"},i.banner=t.createDom("div",{className:"banner"},t.createDom("span",{className:"title"},"Jasmine "),t.createDom("span",{className:"version"},e)),i.symbolSummary=t.createDom("ul",{className:"symbolSummary"}),i.alert=t.createDom("div",{className:"alert"}),i.results=t.createDom("div",{className:"results"},i.summary=t.createDom("div",{className:"summary"}),i.details=t.createDom("div",{id:"details"})))}var t=this,n=e||window.document,r,i={};t.logRunningSpecs=!1;t.reportRunnerStarting=function(e){var s=e.specs()||[];if(s.length==0)return;o(e.env.versionString());n.body.appendChild(i.reporter);r=new jasmine.HtmlReporter.ReporterView(i);r.addSpecs(s,t.specFilter)};t.reportRunnerResults=function(e){r&&r.complete()};t.reportSuiteResults=function(e){r.suiteComplete(e)};t.reportSpecStarting=function(e){t.logRunningSpecs&&t.log(">> Jasmine Running "+e.suite.description+" "+e.description+"...")};t.reportSpecResults=function(e){r.specComplete(e)};t.log=function(){var e=jasmine.getGlobal().console;e&&e.log&&(e.log.apply?e.log.apply(e,arguments):e.log(arguments))};t.specFilter=function(e){return s()?e.getFullName().indexOf(s())===0:!0};return t};jasmine.HtmlReporterHelpers.addHelpers(jasmine.HtmlReporter);jasmine.HtmlReporter.ReporterView=function(e){function t(){e.reporter.className.search(/showDetails/)===-1&&(e.reporter.className+=" showDetails")}function n(e){return typeof e=="undefined"}function r(e){return!n(e)}function i(e){var t=e+" spec";e>1&&(t+="s");return t}this.startedAt=new Date;this.runningSpecCount=0;this.completeSpecCount=0;this.passedCount=0;this.failedCount=0;this.skippedCount=0;this.createResultsMenu=function(){this.resultsMenu=this.createDom("span",{className:"resultsMenu bar"},this.summaryMenuItem=this.createDom("a",{className:"summaryMenuItem",href:"#"},"0 specs")," | ",this.detailsMenuItem=this.createDom("a",{className:"detailsMenuItem",href:"#"},"0 failing"));this.summaryMenuItem.onclick=function(){e.reporter.className=e.reporter.className.replace(/ showDetails/g,"")};this.detailsMenuItem.onclick=function(){t()}};this.addSpecs=function(t,n){this.totalSpecCount=t.length;this.views={specs:{},suites:{}};for(var r=0;r<t.length;r++){var i=t[r];this.views.specs[i.id]=new jasmine.HtmlReporter.SpecView(i,e,this.views);n(i)&&this.runningSpecCount++}};this.specComplete=function(t){this.completeSpecCount++;n(this.views.specs[t.id])&&(this.views.specs[t.id]=new jasmine.HtmlReporter.SpecView(t,e));var r=this.views.specs[t.id];switch(r.status()){case"passed":this.passedCount++;break;case"failed":this.failedCount++;break;case"skipped":this.skippedCount++}r.refresh();this.refresh()};this.suiteComplete=function(e){var t=this.views.suites[e.id];if(n(t))return;t.refresh()};this.refresh=function(){n(this.resultsMenu)&&this.createResultsMenu();if(n(this.runningAlert)){this.runningAlert=this.createDom("a",{href:"?",className:"runningAlert bar"});e.alert.appendChild(this.runningAlert)}this.runningAlert.innerHTML="Running "+this.completeSpecCount+" of "+i(this.totalSpecCount);n(this.skippedAlert)&&(this.skippedAlert=this.createDom("a",{href:"?",className:"skippedAlert bar"}));this.skippedAlert.innerHTML="Skipping "+this.skippedCount+" of "+i(this.totalSpecCount)+" - run all";this.skippedCount===1&&r(e.alert)&&e.alert.appendChild(this.skippedAlert);n(this.passedAlert)&&(this.passedAlert=this.createDom("span",{href:"?",className:"passingAlert bar"}));this.passedAlert.innerHTML="Passing "+i(this.passedCount);n(this.failedAlert)&&(this.failedAlert=this.createDom("span",{href:"?",className:"failingAlert bar"}));this.failedAlert.innerHTML="Failing "+i(this.failedCount);if(this.failedCount===1&&r(e.alert)){e.alert.appendChild(this.failedAlert);e.alert.appendChild(this.resultsMenu)}this.summaryMenuItem.innerHTML=""+i(this.runningSpecCount);this.detailsMenuItem.innerHTML=""+this.failedCount+" failing"};this.complete=function(){e.alert.removeChild(this.runningAlert);this.skippedAlert.innerHTML="Ran "+this.runningSpecCount+" of "+i(this.totalSpecCount)+" - run all";this.failedCount===0?e.alert.appendChild(this.createDom("span",{className:"passingAlert bar"},"Passing "+i(this.passedCount))):t();e.banner.appendChild(this.createDom("span",{className:"duration"},"finished in "+((new Date).getTime()-this.startedAt.getTime())/1e3+"s"))};return this};jasmine.HtmlReporterHelpers.addHelpers(jasmine.HtmlReporter.ReporterView);jasmine.HtmlReporter.SpecView=function(e,t,n){this.spec=e;this.dom=t;this.views=n;this.symbol=this.createDom("li",{className:"pending"});this.dom.symbolSummary.appendChild(this.symbol);this.summary=this.createDom("div",{className:"specSummary"},this.createDom("a",{className:"description",href:"?spec="+encodeURIComponent(this.spec.getFullName()),title:this.spec.getFullName()},this.spec.description));this.detail=this.createDom("div",{className:"specDetail"},this.createDom("a",{className:"description",href:"?spec="+encodeURIComponent(this.spec.getFullName()),title:this.spec.getFullName()},this.spec.getFullName()))};jasmine.HtmlReporter.SpecView.prototype.status=function(){return this.getSpecStatus(this.spec)};jasmine.HtmlReporter.SpecView.prototype.refresh=function(){this.symbol.className=this.status();switch(this.status()){case"skipped":break;case"passed":this.appendSummaryToSuiteDiv();break;case"failed":this.appendSummaryToSuiteDiv();this.appendFailureDetail()}};jasmine.HtmlReporter.SpecView.prototype.appendSummaryToSuiteDiv=function(){this.summary.className+=" "+this.status();this.appendToSummary(this.spec,this.summary)};jasmine.HtmlReporter.SpecView.prototype.appendFailureDetail=function(){this.detail.className+=" "+this.status();var e=this.spec.results().getItems(),t=this.createDom("div",{className:"messages"});for(var n=0;n<e.length;n++){var r=e[n];if(r.type=="log")t.appendChild(this.createDom("div",{className:"resultMessage log"},r.toString()));else if(r.type=="expect"&&r.passed&&!r.passed()){t.appendChild(this.createDom("div",{className:"resultMessage fail"},r.message));r.trace.stack&&t.appendChild(this.createDom("div",{className:"stackTrace"},r.trace.stack))}}if(t.childNodes.length>0){this.detail.appendChild(t);this.dom.details.appendChild(this.detail)}};jasmine.HtmlReporterHelpers.addHelpers(jasmine.HtmlReporter.SpecView);jasmine.HtmlReporter.SuiteView=function(e,t,n){this.suite=e;this.dom=t;this.views=n;this.element=this.createDom("div",{className:"suite"},this.createDom("a",{className:"description",href:"?spec="+encodeURIComponent(this.suite.getFullName())},this.suite.description));this.appendToSummary(this.suite,this.element)};jasmine.HtmlReporter.SuiteView.prototype.status=function(){return this.getSpecStatus(this.suite)};jasmine.HtmlReporter.SuiteView.prototype.refresh=function(){this.element.className+=" "+this.status()};jasmine.HtmlReporterHelpers.addHelpers(jasmine.HtmlReporter.SuiteView);jasmine.TrivialReporter=function(e){this.document=e||document;this.suiteDivs={};this.logRunningSpecs=!1};jasmine.TrivialReporter.prototype.createDom=function(e,t,n){var r=document.createElement(e);for(var i=2;i<arguments.length;i++){var s=arguments[i];typeof s=="string"?r.appendChild(document.createTextNode(s)):s&&r.appendChild(s)}for(var o in t)o=="className"?r[o]=t[o]:r.setAttribute(o,t[o]);return r};jasmine.TrivialReporter.prototype.reportRunnerStarting=function(e){var t,n;this.outerDiv=this.createDom("div",{id:"TrivialReporter",className:"jasmine_reporter"},this.createDom("div",{className:"banner"},this.createDom("div",{className:"logo"},this.createDom("span",{className:"title"},"Jasmine"),this.createDom("span",{className:"version"},e.env.versionString())),this.createDom("div",{className:"options"},"Show ",t=this.createDom("input",{id:"__jasmine_TrivialReporter_showPassed__",type:"checkbox"}),this.createDom("label",{"for":"__jasmine_TrivialReporter_showPassed__"}," passed "),n=this.createDom("input",{id:"__jasmine_TrivialReporter_showSkipped__",type:"checkbox"}),this.createDom("label",{"for":"__jasmine_TrivialReporter_showSkipped__"}," skipped"))),this.runnerDiv=this.createDom("div",{className:"runner running"},this.createDom("a",{className:"run_spec",href:"?"},"run all"),this.runnerMessageSpan=this.createDom("span",{},"Running..."),this.finishedAtSpan=this.createDom("span",{className:"finished-at"},"")));this.document.body.appendChild(this.outerDiv);var r=e.suites();for(var i=0;i<r.length;i++){var s=r[i],o=this.createDom("div",{className:"suite"},this.createDom("a",{className:"run_spec",href:"?spec="+encodeURIComponent(s.getFullName())},"run"),this.createDom("a",{className:"description",href:"?spec="+encodeURIComponent(s.getFullName())},s.description));this.suiteDivs[s.id]=o;var u=this.outerDiv;s.parentSuite&&(u=this.suiteDivs[s.parentSuite.id]);u.appendChild(o)}this.startedAt=new Date;var a=this;t.onclick=function(e){t.checked?a.outerDiv.className+=" show-passed":a.outerDiv.className=a.outerDiv.className.replace(/ show-passed/,"")};n.onclick=function(e){n.checked?a.outerDiv.className+=" show-skipped":a.outerDiv.className=a.outerDiv.className.replace(/ show-skipped/,"")}};jasmine.TrivialReporter.prototype.reportRunnerResults=function(e){var t=e.results(),n=t.failedCount>0?"runner failed":"runner passed";this.runnerDiv.setAttribute("class",n);this.runnerDiv.setAttribute("className",n);var r=e.specs(),i=0;for(var s=0;s<r.length;s++)this.specFilter(r[s])&&i++;var o=""+i+" spec"+(i==1?"":"s")+", "+t.failedCount+" failure"+(t.failedCount==1?"":"s");o+=" in "+((new Date).getTime()-this.startedAt.getTime())/1e3+"s";this.runnerMessageSpan.replaceChild(this.createDom("a",{className:"description",href:"?"},o),this.runnerMessageSpan.firstChild);this.finishedAtSpan.appendChild(document.createTextNode("Finished at "+(new Date).toString()))};jasmine.TrivialReporter.prototype.reportSuiteResults=function(e){var t=e.results(),n=t.passed()?"passed":"failed";t.totalCount===0&&(n="skipped");this.suiteDivs[e.id].className+=" "+n};jasmine.TrivialReporter.prototype.reportSpecStarting=function(e){this.logRunningSpecs&&this.log(">> Jasmine Running "+e.suite.description+" "+e.description+"...")};jasmine.TrivialReporter.prototype.reportSpecResults=function(e){var t=e.results(),n=t.passed()?"passed":"failed";t.skipped&&(n="skipped");var r=this.createDom("div",{className:"spec "+n},this.createDom("a",{className:"run_spec",href:"?spec="+encodeURIComponent(e.getFullName())},"run"),this.createDom("a",{className:"description",href:"?spec="+encodeURIComponent(e.getFullName()),title:e.getFullName()},e.description)),i=t.getItems(),s=this.createDom("div",{className:"messages"});for(var o=0;o<i.length;o++){var u=i[o];if(u.type=="log")s.appendChild(this.createDom("div",{className:"resultMessage log"},u.toString()));else if(u.type=="expect"&&u.passed&&!u.passed()){s.appendChild(this.createDom("div",{className:"resultMessage fail"},u.message));u.trace.stack&&s.appendChild(this.createDom("div",{className:"stackTrace"},u.trace.stack))}}s.childNodes.length>0&&r.appendChild(s);this.suiteDivs[e.suite.id].appendChild(r)};jasmine.TrivialReporter.prototype.log=function(){var e=jasmine.getGlobal().console;e&&e.log&&(e.log.apply?e.log.apply(e,arguments):e.log(arguments))};jasmine.TrivialReporter.prototype.getLocation=function(){return this.document.location};jasmine.TrivialReporter.prototype.specFilter=function(e){var t={},n=this.getLocation().search.substring(1).split("&");for(var r=0;r<n.length;r++){var i=n[r].split("=");t[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return t.spec?e.getFullName().indexOf(t.spec)===0:!0};