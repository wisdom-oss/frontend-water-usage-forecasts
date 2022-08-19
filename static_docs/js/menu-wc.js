'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">water-usage-forecasts documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/WaterUsageForecastsModule.html" data-type="entity-link" >WaterUsageForecastsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WaterUsageForecastsModule-077fcd67c5543d44b3b1f009c0bfcb7ac9034fbed367df5e7067d324ee7b99390e9dbbb31b32a40efc17bde633682d09ec9f2bfad58c57412aad1f9cc73878c4"' : 'data-target="#xs-components-links-module-WaterUsageForecastsModule-077fcd67c5543d44b3b1f009c0bfcb7ac9034fbed367df5e7067d324ee7b99390e9dbbb31b32a40efc17bde633682d09ec9f2bfad58c57412aad1f9cc73878c4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WaterUsageForecastsModule-077fcd67c5543d44b3b1f009c0bfcb7ac9034fbed367df5e7067d324ee7b99390e9dbbb31b32a40efc17bde633682d09ec9f2bfad58c57412aad1f9cc73878c4"' :
                                            'id="xs-components-links-module-WaterUsageForecastsModule-077fcd67c5543d44b3b1f009c0bfcb7ac9034fbed367df5e7067d324ee7b99390e9dbbb31b32a40efc17bde633682d09ec9f2bfad58c57412aad1f9cc73878c4"' }>
                                            <li class="link">
                                                <a href="components/ConsumerDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsumerDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapSelectViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapSelectViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultDataViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultDataViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WaterRightDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WaterRightDetailComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ConsumersService.html" data-type="entity-link" >ConsumersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WaterRightsService.html" data-type="entity-link" >WaterRightsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WaterUsageForecastsService.html" data-type="entity-link" >WaterUsageForecastsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WaterUsageHistoryService.html" data-type="entity-link" >WaterUsageHistoryService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ForecastEntry.html" data-type="entity-link" >ForecastEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastResponse.html" data-type="entity-link" >ForecastResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastUsage.html" data-type="entity-link" >ForecastUsage</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});