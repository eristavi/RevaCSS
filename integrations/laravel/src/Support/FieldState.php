<?php

namespace Reva\Laravel\Support;

use Illuminate\Support\Str;
use Illuminate\Support\ViewErrorBag;
use Illuminate\View\ComponentAttributeBag;
use InvalidArgumentException;

class FieldState
{
    public readonly string $key;
    public readonly string $id;
    public readonly ?string $error;
    public readonly bool $reactive;

    public function __construct(
        public readonly string $name,
        ?string $id,
        public readonly ?string $hint,
        ?string $error,
        string $errorBag,
        private ComponentAttributeBag $attributes,
        public readonly ?string $label,
        bool $hidden = false,
    ) {
        if ($name === '') {
            throw new InvalidArgumentException('A RevaCSS field needs a name.');
        }
        if (!$hidden && !$label && !$attributes->has('aria-label') && !$attributes->has('aria-labelledby')) {
            throw new InvalidArgumentException('A RevaCSS field needs a label, aria-label or aria-labelledby.');
        }
        $this->key = rtrim(preg_replace('/\[([^\]]*)\]/', '.$1', $name), '.');
        $this->id = $id ?: 'reva-'.Str::uuid();
        $errors = view()->shared('errors');
        $message = $errors instanceof ViewErrorBag ? $errors->getBag($errorBag)->first($this->key) : '';
        $this->error = $error ?? ($message !== '' ? $message : null);
        $reactive = false;
        foreach (array_keys($attributes->getAttributes()) as $attribute) {
            if ($attribute === 'wire:model' || str_starts_with($attribute, 'wire:model.')) {
                $reactive = true;
                break;
            }
        }
        $this->reactive = $reactive;
    }

    public function control(array $extra = []): ComponentAttributeBag
    {
        $descriptions = preg_split('/\s+/', trim((string) $this->attributes->get('aria-describedby', '')), -1, PREG_SPLIT_NO_EMPTY);
        if ($this->hint !== null && $this->hint !== '') {
            $descriptions[] = $this->id.'-hint';
        }
        if ($this->error !== null && $this->error !== '') {
            $descriptions[] = $this->id.'-error';
        }
        $extra['id'] = $this->id;
        $extra['name'] = $this->name;
        if ($descriptions) {
            $extra['aria-describedby'] = implode(' ', array_unique($descriptions));
        }
        $invalid = $this->error ? 'true' : $this->attributes->get('aria-invalid');
        if (is_bool($invalid)) $invalid = $invalid ? 'true' : 'false';
        if ($invalid !== null) {
            $extra['aria-invalid'] = $invalid;
        }
        return $this->attributes->except(['aria-describedby', 'aria-invalid'])->merge($extra);
    }

    public function value(mixed $fallback, bool $useOld = true): mixed
    {
        return $useOld && !$this->reactive ? old($this->key, $fallback) : $fallback;
    }

    public static function scalar(mixed $value): string
    {
        if ($value === null) {
            return '';
        }
        if (!is_scalar($value) && !$value instanceof \Stringable) {
            // Malformed previous input must not turn a validation failure into a 500.
            return '';
        }
        return (string) $value;
    }
}
