
class Movement {
    constructor(name, value, isplus) {
        this.name = name;
        this.value = value;
        this.isplus = isplus;
    }
}
class AccountsData {
    constructor(jsonData) {
        this.currentValue = null;
        this.listMovement = [];
        this.netWorth = null;
        if (typeof jsonData === 'undefined' || jsonData == null) return;
        this.currentValue = 15000;
        this.listMovement = [
            new Movement('Test 1', 1500, true),
            new Movement('Test 2', 1000, false),
            new Movement('Test 3', 500, true),

            new Movement('', null, false),
        ];
        this.netWorth = _sa.getNetWorth(this.currentValue, this.list);
    }
}
window._sa = {
    cacheData: new AccountsData(),
    documentready() {
        document.body.classList.add('loaded')
        _sa.events();
        _sa.loadData();
    },
    events() {
        $('body').on('keyup', 'input[data-type="currency"]', function (e) {
            formatCurrency($(this));
            _sa.updateTable();
        }).on('blur', 'input[data-type="currency"]', function (e) {
            formatCurrency($(this), "blur");
        }).on('keypress', 'input', function (e) {
            if (e.which === 13) {
                _sa.updateTable();
                $(this).closest('[data-movements-item]').next('[data-movements-item]')
                    .find(`[data-cell-type=${$(this).attr('data-cell-type')}]`).trigger('focus');
            }
        }).on('focus', 'input', function (e) {
            $(this).closest('[data-movements-item]').addClass('focused')

        }).on('blur', 'input', function (e) {
            $(this).closest('[data-movements-item]').removeClass('focused')
        }).on('click', '[data-btn-way]', function (e) {
            const _way = $(this).closest('[data-movements-item]').attr('data-way');
            switch (_way) {
                case 'plus':
                    $(this).closest('[data-movements-item]').attr('data-way', 'minus')
                    break;
                case 'minus':
                    $(this).closest('[data-movements-item]').attr('data-way', 'plus')
                    break;
                default:
                    break;
            }
            _sa.updateTable();
        });
    },
    updateTable() {
        let _data = new AccountsData();
        this.updateNetWorth();
        _data.currentValue = this.getCurrentValue();
        _data.listMovement = this.getListMovement();
        _data.netWorth = this.getNetWorth(_data.currentValue, _data.list);
        _sa.cacheData = _data;
        console.log(_data);
    },
    updateNetWorth() {
        $('[data-ammount-nw]').val(this.getNetWorth()).trigger('blur');
    },
    getCurrentValue() {
        return Number($('[data-ammount-current]').val().replace(/[^0-9.]/g, ''));
    },
    getNetWorth(currentValue, listMovement) {
        currentValue = currentValue ?? this.getCurrentValue()
        listMovement = listMovement ?? this.getListMovement()
        //
        let _result = currentValue;
        listMovement.forEach(element => {
            _result += element.value * (element.isplus ? 1 : -1);
        });
        return _result;
    },
    getListMovement() {
        let _result = [];
        $('[data-movements-item]').each(function () {
            const $item = $(this);
            const _obj = new Movement(
                $item.find('[data-movement-name]').val(),
                Number($item.find('[data-movement-value]').val().replace(/[^0-9.]/g, '')),
                Number($item.attr('data-way') == 'plus'),
            );
            if (_obj.value > 0) _result.push(_obj);
        });
        return _result;
    },
    loadData() {
        let _data = this.getData();
        this.updateDataView(_data);
        this.updateNetWorth();
        this.formatInputs();
        this.updateTable();
    },
    getData() {
        // let _jsonData = this.getJsonData();
        // return new AccountsData(_jsonData);
        return _loadedData;
    },
    getJsonData() {
        return '';
    },
    updateDataView(data) {
        $container = $('[data-movements-list]');
        $elemCurrentValue = $('[data-ammount-current]');

        $elemCurrentValue.val(data.currentValue);
        $container.html('');
        data.listMovement.forEach(_item => {
            let $newItem = _sa.getNewMovementItem(_item);
            $container.append($newItem);
        })
    },
    getNewMovementItem(movement) {
        return `<div class="item${movement.value == null ? ' new' : ''}" data-movements-item data-way="${movement.isplus ? 'plus' : 'minus'}">
                <span class="way" data-btn-way></span>
                <input data-movement-name data-cell-type="name" type="text" placeholder="Movement type" value="${movement.name}">
                <input data-movement-value data-cell-type="value" data-type="currency" placeholder="Movement value" value="${movement.value ?? ''}">
                </div>`
    },
    updateDB() {
        this.updateJsonFile();
    },
    updateJsonFile() {

    },
    formatInputs() {
        $('input').trigger('blur');
    },
}

function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") { return; }

    // original length
    var original_len = input_val.length;

    // initial caret position 
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");

        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);

        // add commas to left side of number
        left_side = formatNumber(left_side);

        // validate right side
        right_side = formatNumber(right_side);

        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
            right_side += "00";
        }

        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);

        // join number by .
        input_val = `₺ ${left_side}.${right_side}`;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = `₺ ${input_val}`;

        // final formatting
        if (blur === "blur") {
            input_val += ".00";
        }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}






document.addEventListener('DOMContentLoaded', _sa.documentready, false);