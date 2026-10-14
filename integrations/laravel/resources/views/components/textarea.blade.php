@props(['name', 'label' => null, 'id' => null, 'value' => null, 'hint' => null, 'error' => null, 'errorBag' => 'default', 'useOld' => true])
@php
    $field = new \Reva\Laravel\Support\FieldState($name, $id, $hint, $error, $errorBag, $attributes, $label);
    $content = $field->reactive ? '' : \Reva\Laravel\Support\FieldState::scalar($field->value($value ?? (string) $slot, $useOld));
@endphp
<div class="form-group">
    @if($label)<label for="{{ $field->id }}">{{ $label }} @if($attributes->get('required'))<small>({{ __('required') }})</small>@endif</label>@endif
    <textarea {{ $field->control() }}>{{ $content }}</textarea>
    @include('reva::partials.field-messages')
</div>
