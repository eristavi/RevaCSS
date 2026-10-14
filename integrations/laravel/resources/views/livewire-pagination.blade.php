@if($paginator->hasPages())
    <nav class="pagination" aria-label="{{ __('Pagination') }}">
        <ol role="list">
            <li>@if($paginator->onFirstPage())<span aria-disabled="true">{{ __('Previous') }}</span>@else<a href="{{ $paginator->previousPageUrl() }}" wire:click.prevent="previousPage(@js($paginator->getPageName()))" rel="prev">{{ __('Previous') }}</a>@endif</li>
            @foreach($elements as $element)
                @if(is_string($element))<li><span aria-label="{{ __('More pages') }}">{{ $element }}</span></li>@endif
                @if(is_array($element))
                    @foreach($element as $page => $url)
                        <li wire:key="reva-page-{{ $paginator->getPageName() }}-{{ $page }}">
                            @if($page === $paginator->currentPage())<span aria-current="page" aria-label="{{ __('Page :page', ['page' => $page]) }}">{{ $page }}</span>
                            @else<a href="{{ $url }}" wire:click.prevent="gotoPage({{ $page }}, @js($paginator->getPageName()))" aria-label="{{ __('Page :page', ['page' => $page]) }}">{{ $page }}</a>@endif
                        </li>
                    @endforeach
                @endif
            @endforeach
            <li>@if($paginator->hasMorePages())<a href="{{ $paginator->nextPageUrl() }}" wire:click.prevent="nextPage(@js($paginator->getPageName()))" rel="next">{{ __('Next') }}</a>@else<span aria-disabled="true">{{ __('Next') }}</span>@endif</li>
        </ol>
    </nav>
@endif
