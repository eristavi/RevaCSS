@props(['name', 'label', 'value', 'id' => null, 'checked' => false, 'hint' => null, 'error' => null, 'errorBag' => 'default', 'useOld' => true])
@php
    $field = new \Reva\Laravel\Support\FieldState($name, $id, $hint, $error, $errorBag, $attributes, $label);
    $isChecked = $checked;
    if ($useOld && !$field->reactive && request()->hasSession() && session()->has('_old_input')) $isChecked = \Reva\Laravel\Support\FieldState::scalar(old($field->key)) === (string) $value;
    $extra = ['type' => 'radio', 'value' => $value];
    if (!$field->reactive && $isChecked) $extra['checked'] = true;
@endphp
<div class="form-group">
    <label for="{{ $field->id }}"><input {{ $field->control($extra) }}> {{ $label }}</label>
    @include('reva::partials.field-messages')
</div>
