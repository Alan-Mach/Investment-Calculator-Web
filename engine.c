#include <math.h>
#include <stdlib.h>
#include <emscripten.h>

static double* result_buffer = NULL;

EMSCRIPTEN_KEEPALIVE
double* calculate_icif_table(double target_A, double initial_c, double r, double i, int t, int n, int mode) {
    int total_periods = n * t;
    if (result_buffer) free(result_buffer);
    result_buffer = (double*)malloc(total_periods * 4 * sizeof(double));

    double r_n = 1.0 + (r / n);
    double i_n = 1.0 + (i / n);
    double c = initial_c;

    if (mode == 1) { // Calculate c from A
        double nt = (double)(n * t);
        double denom = r_n - i_n;
        if (fabs(denom) < 1e-9) {
            c = target_A / (nt * pow(i_n, nt));
        } else {
            c = target_A / (((pow(r_n, nt + 1.0) - pow(i_n, nt + 1.0)) / denom) - pow(i_n, nt));
        }
    }

    // Tabularizing
    double current_contribution = c;
    double total_contributed = c;
    double total_value = c * r_n;

    result_buffer[0] = (double)1;
    result_buffer[1] = current_contribution;
    result_buffer[2] = total_contributed;
    result_buffer[3] = total_value;

    for (int k = 1; k < total_periods; k++) {
        current_contribution *= i_n;
        total_contributed += current_contribution;
        total_value = (total_value + current_contribution) * r_n;

        result_buffer[k * 4 + 0] = (double)(k + 1);
        result_buffer[k * 4 + 1] = current_contribution;
        result_buffer[k * 4 + 2] = total_contributed;
        result_buffer[k * 4 + 3] = total_value;
    }
    return result_buffer;
}