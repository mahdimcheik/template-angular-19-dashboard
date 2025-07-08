import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, NotificationsWidget],
    templateUrl: './app.dashboard.html'
})
export class Dashboard {}
