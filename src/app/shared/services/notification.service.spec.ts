import { TestBed } from '@angular/core/testing';

import { NotificationsMainService } from './notification.service';

describe('NotificationService', () => {
    let service: NotificationsMainService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NotificationsMainService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
