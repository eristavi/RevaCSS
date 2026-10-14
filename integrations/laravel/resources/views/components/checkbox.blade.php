@props(['name', 'label', 'id' => null, 'value' => '1', 'checked' => false, 'unchecked' => '0', 'hint' => null, 'error' => null, 'errorBag' => 'default', 'useOld' => true])
@php
    $field = new \Reva\Laravel\Support\FieldState($name, $id, $hint, $error, $errorBag, $attributes, $label);
    $isChecked = $checked;
    if ($useOld && !$field->reactive && request()->hasSession() && session()->has('_old_input')) {
        $oldValue = old($field->key);
        $isChecked = is_array($oldValue) ? in_array((string) $value, array_map([\Reva\Laravel\Support\FieldState::class, 'scalar'], $oldValue), true) : \Reva\Laravel\Support\FieldState::scalar($oldValue) === (string) $value;
    }
    $extra = ['type' => 'checkbox', 'value' => $value];
    if (!$field->reactive && $isChecked) $extra['checked'] = true;
@endphp
<div class="form-group">
    @if(!$field->reactive && $unchecked !== null)
        <input type="hidden" name="{{ $name }}" value="{{ $unchecked }}" @disabled($attributes->get('disabled'))>
    @endif
    <label for="{{ $field->id }}"><input {{ $field->control($extra) }}> {{ $label }}</label>
    @include('reva::partials.field-messages')
</div>
