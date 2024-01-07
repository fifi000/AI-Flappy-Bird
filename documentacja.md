# Dokumentacja Algorytmu NEAT dla Gry Flappy Bird

## Wprowadzenie

Projekt przedstawia rozwiązanie problemu gry w **Flappy Bird** przy pomocy algorytmu genetycznego. Celem gry Flappy Bird jest przeprowadzenie ptaka przez przeszkody, które pojawiają się na ekranie. Ptak może poruszać się tylko w górę i w dół, a przeszkody pojawiają się na różnych wysokościach. Gracz zdobywa punkt za każdą przeszkodę, którą ptak przeleci. Jeśli ptak uderzy w przeszkodę lub spadnie na ziemię, rozgrywka kończy się. 

<!-- Wstawić obrazek ilustrujący grę flappy bird -->

Celem projektu jest stworzenie algorytmu, który osiągnie 1000 punktów, co oznacza pokonanie 1000 przeszkód.

## Rozwiązanie Problemu

Aby osiągnąć zamierzony cel wykorzystano algorytm NEAT (ang. Neuroevolution of Augmenting Topologies - pl. Neuroewolucja z Rozszerzaniem Topologii). Algorytm NEAT jest jednym z rodziny algorytmów genetycznych. Wykorzystuje ewolucję sieci neuronowych, pozwalając na adaptacyjne trenowanie sztucznych graczy w grze Flappy Bird. Każdy sztuczny gracz jest reprezentowany przez sieć neuronową, która podejmuje decyzje (skok/nie skok) na podstawie analizy danych wejściowych.

### Struktura Algorytmu NEAT

#### Parametry sieci

Sztuczna sieć neuronowa to model obliczeniowy inspirowany strukturą ludzkiego mózgu. Ludzki mózg składa się z ogromnej liczby komórek nerwowych, zwanych neuronami. Neurony działają w bardzo prosty sposób. Jeśli przychodzące bodźce są wystarczająco silne, neuron przesyła impuls elektryczny, wzdłuż swojego aksonu do innych neuronów, które są z nim połączone. Neuron działa więc jak przełącznik typu "wszystko albo nic", który przyjmuje zestaw sygnałów wejściowych i albo wysyła informajcę dalej, albo nie wysyła niczego. [Deep Learning - John D. Kelleher](). 

Modelowy neuron jest nazywany jednostką progową, a jego wartość $z$ liczona jest przy pomocy funkcji sumy:
$$
z=\sum_{i=1}^{N} {w_{i}x_{i}}
$$
gdzie $[x_{1},\dots,x_{N}]$ jest zbiorem wartości wejściowych dla $N$ połączeń, przy czym każde połączenie ma określoną wagę $[w_{1},\dots,w_{N}]$. Neuron otrzymuje dane wejściowe od wielu innych jednostek lub źródeł zewnętrznych, mnoży każde wejście przez określone wagi połączeń i sumuje je. [Rys 2] przedstawia strukturę sztucznego neuronu.

![Alt text](/dokumentacja_imgs/ann.png)  
[Rys 2]

Sieć użyta w rozwiązaniu, jako genom, składa się z 2 warstw. Warstwa wejściowa złożona jest z 3 neuronów, natomiast warstwa wyjściowa tylko z 1. Każdy neuron w warstwie wejściowej jest połączony z neuronem wyjściowym. 

Początkowo zarówno każdy neuron wejściowy jak i każde połączenie w sieci ma wartość z przedziału $[0,1]$.

<!-- Tu skończyłem -->
<!-- dokończyć o mutacjach wag i biasów -->
<!-- dodać ilustrację wykorzystywanej sieci -->

- Liczba warstw: Sieć składa się z warstwy wejściowej, warstwy wyjściowej i ukrytych warstw.
- Liczba neuronów: Określa liczbę neuronów w warstwach.
- Mutacje wag i biasów: Algorytm uwzględnia mutacje wag i biasów neuronów w celu poprawy wydajności.

#### Inicjalizacja populacji

- Tworzenie populacji: Inicjalizacja populacji graczy z losowymi wagami i biasami w sieciach neuronowych.
- Liczba populacji: Użytkownik może określić liczbę populacji graczy.

#### Ocena sieci

- Funkcja oceny: Wykorzystuje dane wejściowe (pozycja gracza, przeszkody) do obliczenia wyjścia sieci i podejmowania decyzji (skok/nie skok).
- Metoda aktywacji: Funkcja aktywacji neuronów (np. tangens hiperboliczny) w sieci.

#### Proces ewolucji

- Sortowanie populacji: Ocena populacji graczy i sortowanie ich na podstawie wyników.
- Elityzm: Zachowanie najlepszych osobników z populacji do następnej generacji.
- Krzyżowanie i mutacja: Tworzenie potomstwa przez krzyżowanie i mutację najlepszych osobników.

## Implementacja w Kodzie

- Inicjalizacja sieci: Tworzenie struktury sieci neuronowej z odpowiednią liczbą neuronów.
- Ewaluacja sieci: Ocena wydajności graczy na podstawie danych wejściowych.
- Proces ewolucji: Krzyżowanie, mutacja i tworzenie kolejnych generacji populacji graczy.

## Podsumowanie

Algorytm NEAT w grze Flappy Bird umożliwia ewolucję zachowań graczy poprzez adaptacyjne uczenie się na podstawie wyników, co prowadzi do stopniowego poprawiania osiąganych wyników i zdolności graczy w grze.