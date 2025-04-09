import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { NotificationApp } from '../../shared/models/notification';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, NotificationsWidget],
    templateUrl: './app.dashboard.html'
})
export class Dashboard {}
