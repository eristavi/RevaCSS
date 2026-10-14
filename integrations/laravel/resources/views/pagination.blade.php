@if($paginator->hasPages())
    <nav class="pagination" aria-label="{{ __('Pagination') }}">
        <ol role="list">
            <li>@if($paginator->onFirstPage())<span aria-disabled="true">{{ __('Previous') }}</span>@else<a href="{{ $paginator->previousPageUrl() }}" rel="prev">{{ __('Previous') }}</a>@endif</li>
            @foreach($elements as $element)
                @if(is_string($element))<li><span aria-label="{{ __('More pages') }}">{{ $element }}</span></li>@endif
                @if(is_array($element))
                    @foreach($element as $page => $url)
                        <li>@if($page === $paginator->currentPage())<span aria-current="page" aria-label="{{ __('Page :page', ['page' => $page]) }}">{{ $page }}</span>@else<a href="{{ $url }}" aria-label="{{ __('Page :page', ['page' => $page]) }}">{{ $page }}</a>@endif</li>
                    @endforeach
                @endif
            @endforeach
            <li>@if($paginator->hasMorePages())<a href="{{ $paginator->nextPageUrl() }}" rel="next">{{ __('Next') }}</a>@else<span aria-disabled="true">{{ __('Next') }}</span>@endif</li>
        </ol>
    </nav>
@endif
