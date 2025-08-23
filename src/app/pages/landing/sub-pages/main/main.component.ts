import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopbarWidget } from '../../components/topbar-landing/topbarwidget.component';
import { HeroWidget } from '../../components/herowidget/herowidget';
import { FeaturesWidget } from '../../components/features/featureswidget';
import { HighlightsWidget } from '../../components/highlight/highlightswidget';
import { FooterWidget } from '../../components/footerwidget/footerwidget';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TeacherPublicProfileComponent } from '../teacher-public-profile/teacher-public-profile.component';

@Component({
    selector: 'app-main',
    imports: [RouterModule, FeaturesWidget, HeroWidget, HighlightsWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule],

    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {}
