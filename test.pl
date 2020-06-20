:- use_module(library(clpfd)).

z(Top, Bottom) :-
    Top in -65000..65000,
    Bottom in -65000..65000,
    Top #> Bottom,
    Bottom #> 0.
