package matching;

import java.util.Comparator;

public class AskComparator implements Comparator<Ask>
{
    public int compare(Ask x, Ask y)
    {
        if (x.getPrice() < y.getPrice()) {
            return -1;
        }
        if (x.getPrice() > y.getPrice()) {
            return 1;
        }

        // prices are the same. see which came first, thats given priority

        if (x.getDate().before(y.getDate())) {
            return -1;
        }

        if (y.getDate().before(x.getDate())) {
            return 1;
        }

        return 0;
    }
}