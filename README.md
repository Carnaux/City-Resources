# City Resources

City Resources is a project made for a Statistics and Probability class.

#### How it works

This project generates a random city with 3 types of buildings, each building has its own random number and type of household goods and each household goods have a predefined consume of energy and/or water wich is used to calculate the total of energy and water consumed in a day. Example:

The code generated a house type 1:

- House type 1:
    - N of residents: 3
    - Shower:
        - energy: In a 15 min shower it uses N (kW/h) * N of residents
        - water: In a 15 min shower it uses N (L) * N of residents
    - Dish washer:
        - energy: N (kW/h) per cycle
        - water: N (L) per cycle

and so on...

When the code finish generating the city it uses default values to generate a rain/drought regime wich determines the energy and consumable water production. 


References

www.pha.poli.usp.br/LeArq.aspx?id_arq=7813

http://hidro.gd/calculando-a-energia-gerada/

https://www.slideshare.net/YaraNeves3/6-modelos-chuva-vazo-rubertoparte1

http://www.evolvedoc.com.br/sbrh/detalhes-185_calibracao-de-um-modelo-hidrologico-tipo-chuva-vazao-para-bacia-hidrografica-do-rio-do-peixe

http://www.deha.ufc.br/ticiana/Arquivos/Graduacao/Apostila_Hidrologia_grad/Cap_8_Escoamento_Superficial.pdf

https://capacitacao.ead.unesp.br/dspace/bitstream/ana/66/2/Unidade_1.pdf

https://www.usbr.gov/power/edu/pamphlet.pdf

https://www.guiadaengenharia.com/dimensionamento-de-uma-eta/
