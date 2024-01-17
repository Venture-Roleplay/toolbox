let _cuffState: boolean = false;
let _dragState: boolean = false;
let _dragStateControlsCuffAnimation: boolean = false;

export function cuffState(newValue?: boolean) {
    if (!newValue) {
        return _cuffState;
    }
    _cuffState = newValue;
}

export function dragState(newValue?: boolean) {
    if (!newValue) {
        return _dragState;
    }
    _dragState = newValue;
}

export function dragStateControlsCuffAnimation(newValue?: boolean) {
    if (!newValue) {
        return _dragStateControlsCuffAnimation;
    }
    _dragStateControlsCuffAnimation = newValue;
}
