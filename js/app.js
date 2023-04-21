$(function() {
    const rates = [
        {maxPeriod: 36, percent: 25},
        {maxPeriod: 15, percent: 30},
    ];

    let mxn = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0
    });

    let $periodField = $('#period');
    let $periodRangeField = $('#period-range');
    let $paymentField = $('#payment');
    let $totalEl = $('#total');

    function PV (rate, periods, payment, future = 0, type = 0) {
        // Evaluate rate and periods
        rate = parseFloat(rate);
        periods = parseInt(periods);

        // Return present value
        if (rate === 0) {
            return - payment * periods - future;
        } else {
            return (((1 - Math.pow(1 + rate, periods)) / rate) * payment * (1 +rate * type) - future) / Math.pow(1 + rate, periods);
        }
    }
    
    function calculate() {
        let period = $periodRangeField.val();
        let percent = 0;
        $.each(rates, function(key, ratePeriod) {
            if (period > ratePeriod.maxPeriod) {
                return false;
            }

            percent = ratePeriod.percent;
        });

        let rate = (percent / 100) / 12;
        let presentValue = PV(rate, period, $paymentField.val());
        $totalEl.text(mxn.format(Math.round(Math.abs(presentValue))));
    }

    $periodRangeField.on('input', function (e) {
        let $this = $(this);
        $periodField.val($this.val());
        calculate();
    });

    $paymentField.on('input', function (e) {
        calculate();
    });

    calculate();
})