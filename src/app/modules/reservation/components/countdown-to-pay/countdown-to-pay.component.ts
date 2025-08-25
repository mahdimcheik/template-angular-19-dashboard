import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, effect, input, output, signal } from '@angular/core';
import { InitEditableRow } from 'primeng/table';
import { interval, Subscription } from 'rxjs';

@Component({
    imports: [DecimalPipe, CommonModule],
    selector: 'app-countdown-to-pay',
    template: `
        @if (show()) {
            <div><span>Temps restant pour payer </span> {{ minutes() }}:{{ seconds() | number: '2.0' }}</div>
        }
    `,
    styleUrls: ['./countdown.scss']
})
export class CountdownToPayComponent implements OnDestroy {
    minutesTotal = input.required<number>();
    secondsTotal = input.required<number>();
    show = input(false);
    onCountEnd = output<void>();

    minutes = signal(0);
    seconds = signal(0);
    private intervalSubscription?: Subscription;

    constructor() {
        effect(() => {
            this.minutes.set(this.minutesTotal());
            this.seconds.set(this.secondsTotal());
            this.IntializeCounter();
        });
    }

    private IntializeCounter(): void {
        this.stopCounter();

        if (this.minutesTotal() > 0) {
            let tempsRestantEnSecondes = this.minutesTotal() * 60 + this.secondsTotal();

            this.intervalSubscription = interval(1000).subscribe(() => {
                tempsRestantEnSecondes--;
                this.minutes.set(Math.floor(tempsRestantEnSecondes / 60));
                this.seconds.set(tempsRestantEnSecondes % 60);

                if (tempsRestantEnSecondes <= 0) {
                    this.onCountEnd.emit();
                    this.stopCounter();
                }
            });
        } else {
            this.minutes.set(0);
            this.seconds.set(0);
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
