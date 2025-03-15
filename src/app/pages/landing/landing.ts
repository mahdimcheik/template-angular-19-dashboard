import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbar-landing/topbarwidget.component';
import { HeroWidget } from './components/herowidget/herowidget';
import { FeaturesWidget } from './components/features/featureswidget';
import { HighlightsWidget } from './components/highlight/highlightswidget';
import { PricingWidget } from './components/pricing/pricingwidget';
import { FooterWidget } from './components/footerwidget/footerwidget';
import { TeacherPublicProfileComponent } from './sub-pages/teacher-public-profile/teacher-public-profile.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />

                <!-- <div id="profile" class="text-center py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
                    <div class="py-6 mt-8 ">
                        <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Qui je suis?</div>
                        <app-teacher-public-profile />
                    </div>
                </div>
                <features-widget />
                <highlights-widget /> -->
                <router-outlet></router-outlet>

                <footer-widget />
            </div>
        </div>
    `
})
export class Landing {}
