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
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/WaterUsageForecastsModule.html" data-type="entity-link" >WaterUsageForecastsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-WaterUsageForecastsModule-d7fa6e34cf5734b5fff9446ff3d3356631fa2eb77d30bf0919c5a5a055bf5ae4550a0744619a67c5cdfcd2cd2c3abf55914687881228987f5b33eec128bd1096"' : 'data-bs-target="#xs-components-links-module-WaterUsageForecastsModule-d7fa6e34cf5734b5fff9446ff3d3356631fa2eb77d30bf0919c5a5a055bf5ae4550a0744619a67c5cdfcd2cd2c3abf55914687881228987f5b33eec128bd1096"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WaterUsageForecastsModule-d7fa6e34cf5734b5fff9446ff3d3356631fa2eb77d30bf0919c5a5a055bf5ae4550a0744619a67c5cdfcd2cd2c3abf55914687881228987f5b33eec128bd1096"' :
                                            'id="xs-components-links-module-WaterUsageForecastsModule-d7fa6e34cf5734b5fff9446ff3d3356631fa2eb77d30bf0919c5a5a055bf5ae4550a0744619a67c5cdfcd2cd2c3abf55914687881228987f5b33eec128bd1096"' }>
                                            <li class="link">
                                                <a href="components/ConsumerDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsumerDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapSelectViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapSelectViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProphetForecastResultDataComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProphetForecastResultDataComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultDataComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultDataComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultDataViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultDataViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WaterRightDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WaterRightDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WaterUsageForecastsResultDataComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WaterUsageForecastsResultDataComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ConsumersService.html" data-type="entity-link" >ConsumersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProphetForecastService.html" data-type="entity-link" >ProphetForecastService</a>
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
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Datapoint.html" data-type="entity-link" >Datapoint</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastEntry.html" data-type="entity-link" >ForecastEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastResponse.html" data-type="entity-link" >ForecastResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastResponse-1.html" data-type="entity-link" >ForecastResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ForecastUsage.html" data-type="entity-link" >ForecastUsage</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
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
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});