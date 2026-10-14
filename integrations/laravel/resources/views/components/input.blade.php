@props(['name', 'label' => null, 'type' => 'text', 'id' => null, 'value' => null, 'hint' => null, 'error' => null, 'errorBag' => 'default', 'useOld' => true])
@php
    $types = ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'datetime-local', 'month', 'week', 'time', 'color', 'range', 'file', 'hidden'];
    if (!in_array($type, $types, true)) throw new \InvalidArgumentException('Unsupported input type; use a choice component for checkbox/radio.');
    $field = new \Reva\Laravel\Support\FieldState($name, $id, $hint, $error, $errorBag, $attributes, $label, $type === 'hidden');
    $extra = ['type' => $type];
    if (!$field->reactive && !in_array($type, ['password', 'file'], true)) $extra['value'] = \Reva\Laravel\Support\FieldState::scalar($field->value($value, $useOld));
    $control = $field->control($extra);
@endphp
@if($type !== 'hidden')<div class="form-group">
    @if($label)<label for="{{ $field->id }}">{{ $label }} @if($attributes->get('required'))<small>({{ __('required') }})</small>@endif</label>@endif
@endif
    <input {{ $control }}>
@if($type !== 'hidden')
    @include('reva::partials.field-messages')
</div>@endif
