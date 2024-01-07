# Dokumentacja Algorytmu NEAT dla Gry Flappy Bird

## Wprowadzenie

Projekt przedstawia rozwiązanie problemu gry w **Flappy Bird** przy pomocy algorytmu genetycznego. Celem gry Flappy Bird jest przeprowadzenie ptaka przez przeszkody, które pojawiają się na ekranie. Ptak może poruszać się tylko w górę i w dół, a przeszkody pojawiają się na różnych wysokościach. Gracz zdobywa punkt za każdą przeszkodę, którą ptak przeleci. Jeśli ptak uderzy w przeszkodę lub spadnie na ziemię, rozgrywka kończy się. 

![Zdjęcie gry](/dokumentacja_imgs/game.png)
[Rys 1 - Zdjęcie początku gry z populacją 500 osobników]

Celem jest osiągnięcie 1000 punktów, co oznacza pokonanie przez osobnika 1000 przeszkód.

## Rozwiązanie Problemu

Do osiągnięcia zamierzonego celu wykorzystano algorytm NEAT (ang. Neuroevolution of Augmenting Topologies - pl. Neuroewolucja z Rozszerzaniem Topologii). Algorytm NEAT jest jednym z rodziny algorytmów genetycznych. Wykorzystuje ewolucję sieci neuronowych, pozwalając na adaptacyjne trenowanie sztucznych graczy w grze Flappy Bird. Każdy sztuczny gracz jest reprezentowany przez sieć neuronową, która podejmuje decyzje (skok/nie skok) na podstawie analizy danych wejściowych.

### Struktura Algorytmu NEAT

#### Parametry sieci

Sztuczna sieć neuronowa to model obliczeniowy inspirowany strukturą ludzkiego mózgu. Ludzki mózg składa się z ogromnej liczby komórek nerwowych, zwanych neuronami. Neurony działają w bardzo prosty sposób. Jeśli przychodzące bodźce są wystarczająco silne, neuron przesyła impuls elektryczny, wzdłuż swojego aksonu do innych neuronów, które są z nim połączone. Neuron działa więc jak przełącznik typu "wszystko albo nic", który przyjmuje zestaw sygnałów wejściowych i albo wysyła informajcę dalej, albo nie wysyła niczego. [Deep Learning - John D. Kelleher](). 

Modelowy neuron jest nazywany jednostką progową, a jego wartość $z$ liczona jest przy pomocy funkcji sumy:
$$
z=\sum_{i=1}^{N} {w_{i}x_{i}}
$$
gdzie $[x_{1},\dots,x_{N}]$ jest zbiorem wartości wejściowych dla $N$ połączeń, przy czym każde połączenie ma określoną wagę $[w_{1},\dots,w_{N}]$. Neuron otrzymuje dane wejściowe od wielu innych jednostek lub źródeł zewnętrznych, mnoży każde wejście przez określone wagi połączeń i sumuje je. [Rys 2] przedstawia strukturę sztucznego neuronu.

![Alt text](/dokumentacja_imgs/ann.png)  
[Rys 2 - Struktura sztucznego neuronu]

Sieć użyta w rozwiązaniu, jako genom, składa się z 2 warstw. Warstwa wejściowa złożona jest z 3 neuronów, natomiast warstwa wyjściowa tylko z 1. Każdy neuron w warstwie wejściowej jest połączony z neuronem wyjściowym. 

![Przykładowy startowy stan genomu](/dokumentacja_imgs/network.png)  
[Rys 3 - Stan startowy genomu przykładowego badanego osobnika, liczby oznaczają wartości bias, natomiast grubość połączeń ich wagę]

#### Proces ewolucji

Początkowo dla każdego osobnika zostaje przydzielony genom z losowymi wartościami.

Następnie z każdą badaną generacją wykorzystany algorytm NEAT stosuje strategie zarówno eksploracyjne, jak i eksploatacyjne, próbując znaleźć optymalne rozwiązania w przestrzeni rozwiązań.

Jedną z tych strategii jest mutacja wag i biasów. Poprzez ich losowe zmiany, NEAT może optymalizować sieci neuronowe w celu osiągnięcia lepszego wyniku.

Kolejną ważną strategią jest elitycyzm. Jest to strategia selekcji, która zachowuje najlepsze osobniki z jednej generacji do następnej generacji bez dokonywania na nich żadnych zmian. Elitycyzm jest używany w celu zachowania informacji genetycznej najlepszych osobników i przekazania ich do kolejnych pokoleń w celu utrzymania stabilności i kontynuowania postępu ewolucyjnego.

Jeszcze inną strategią jest krzyżowanie. Strategia ta odnosi się do losowego łączenia genotypów 2 osobników w celu stworzenia potomka dziedziczącego. Proces ten pozwala na większą eksplorację przestrzeni rozwiązań i zwiększenie różnorodności w populacji.

## Wyniki

- Tabela wyników | najlepszy osobnik każdej generacji w 10 generacjach + jego genotyp (wagi i biasy)
- Tabela różnych startowych ustawień (populacja <50, 100> żeby nie za szybko też dochodziło), z informacją ile generacji/razem populacji do osiągnięca oczekiwanego wyniku
- Interpretacja tych tabel

## Podsumowanie

Algorytm NEAT w grze Flappy Bird umożliwia ewolucję zachowań graczy poprzez adaptacyjne uczenie się na podstawie wyników, co prowadzi do stopniowego poprawiania osiąganych wyników i zdolności graczy w grze.