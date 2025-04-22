import { DecimalPipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, input, output } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
    imports: [DecimalPipe],
    selector: 'app-countdown-to-pay',
    template: ` <div><span>Temps restant pour payer </span> {{ minutes }}:{{ seconds | number: '2.0' }}</div> `,
    styleUrls: ['./countdown.scss']
})
export class CountdownToPayComponent implements OnChanges, OnDestroy {
    minutesTotal = input<number>(0);
    onCountEnd = output<void>();

    minutes: number = 0;
    seconds: number = 0;
    private intervalSubscription?: Subscription;

    ngOnChanges(): void {
        this.IntializeCounter();
    }

    private IntializeCounter(): void {
        this.stopCounter();

        if (this.minutesTotal() > 0) {
            let tempsRestantEnSecondes = this.minutesTotal() * 60;

            this.intervalSubscription = interval(1000).subscribe(() => {
                tempsRestantEnSecondes--;
                this.minutes = Math.floor(tempsRestantEnSecondes / 60);
                this.seconds = tempsRestantEnSecondes % 60;

                if (tempsRestantEnSecondes <= 0) {
                    this.onCountEnd.emit();
                    this.stopCounter();
                }
            });
        } else {
            this.minutes = 0;
            this.seconds = 0;
        }
    }

    private stopCounter(): void {
        if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
        }
    }

    ngOnDestroy(): void {
        this.intervalSubscription?.unsubscribe();
        this.stopCounter();
    }
}
