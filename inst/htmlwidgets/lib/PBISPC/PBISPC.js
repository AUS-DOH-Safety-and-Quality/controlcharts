var spc = (function (exports, frontends, powerbi, rendering, spc, math, settings, data) {
    'use strict';

    function commonCause(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M106.903 196.084 144.607 228.433 138.766 235.241 101.062 202.892Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M146.159 218.909 179.921 159.846 187.708 164.298 153.946 223.361Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M198.708 154.94 239.365 214.134 231.971 219.212 191.314 160.019Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M238.825 216.117 285.383 198.784 288.512 207.19 241.954 224.523Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M76.5001 195C76.5001 183.678 85.6782 174.5 97.0001 174.5 108.322 174.5 117.5 183.678 117.5 195 117.5 206.322 108.322 215.5 97.0001 215.5 85.6782 215.5 76.5001 206.322 76.5001 195Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M123.5 233C123.5 221.678 132.678 212.5 144 212.5 155.322 212.5 164.5 221.678 164.5 233 164.5 244.322 155.322 253.5 144 253.5 132.678 253.5 123.5 244.322 123.5 233Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M170.5 153.5C170.5 141.902 179.902 132.5 191.5 132.5 203.098 132.5 212.5 141.902 212.5 153.5 212.5 165.098 203.098 174.5 191.5 174.5 179.902 174.5 170.5 165.098 170.5 153.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M217.5 221.5C217.5 209.902 226.902 200.5 238.5 200.5 250.098 200.5 259.5 209.902 259.5 221.5 259.5 233.098 250.098 242.5 238.5 242.5 226.902 242.5 217.5 233.098 217.5 221.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M265.5 206.5C265.5 194.902 274.678 185.5 286 185.5 297.322 185.5 306.5 194.902 306.5 206.5 306.5 218.098 297.322 227.5 286 227.5 274.678 227.5 265.5 218.098 265.5 206.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#A6A6A6")
            .attr("fill-rule", "evenodd");
    }

    function concernHigh(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 17.47 328.36)");
        selection.append("path")
            .attr("d", "M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 38 340)");
        selection.append("text")
            .attr("fill", "#E46C0A")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 172) scale(10, 10)")
            .text("H");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)");
        selection.append("path")
            .attr("d", "M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 76.5001 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 123.5 249.5)");
        selection.append("path")
            .attr("d", "M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 170.5 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 217.5 185.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 265.5 200.5)");
    }

    function concernLow(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#E46C0A")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 292) scale(10, 10)")
            .text("L");
        selection.append("path")
            .attr("d", "M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#E46C0A")
            .attr("fill-rule", "evenodd");
    }

    function improvementHigh(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M0 155.53C-1.9801e-14 69.6331 69.6331-1.9801e-14 155.53-3.96021e-14 241.427-7.92042e-14 311.06 69.6331 311.06 155.53 311.06 241.427 241.427 311.06 155.53 311.06 69.6331 311.06-9.90052e-14 241.427 0 155.53Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 17.47 328.36)");
        selection.append("path")
            .attr("d", "M0 151C-1.92243e-14 67.605 67.605-1.92243e-14 151-3.84486e-14 234.395-7.68973e-14 302 67.605 302 151 302 234.395 234.395 302 151 302 67.605 302-9.61216e-14 234.395 0 151Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 38 340)");
        selection.append("text")
            .attr("fill", "#00B0F0")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 172) scale(10, 10)")
            .text("H");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.919094 0.394039 0.394039 -0.919094 95.4025 215.096)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.880045 -0.47489 -0.47489 -0.880045 149.897 232.457)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.715824 -0.698281 -0.698281 -0.715824 199.882 206.276)");
        selection.append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "49.6797")
            .attr("height", "8.97008")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("transform", "matrix(0.937161 0.348898 0.348898 -0.937161 238.113 168.387)");
        selection.append("path")
            .attr("d", "M0 21C-2.60992e-15 9.40202 9.17816-2.67358e-15 20.5-5.34716e-15 31.8218-1.06943e-14 41 9.40202 41 21 41 32.598 31.8218 42 20.5 42 9.17816 42-1.30496e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 76.5001 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 123.5 249.5)");
        selection.append("path")
            .attr("d", "M0 21C-2.67358e-15 9.40202 9.40202-2.67358e-15 21-5.34716e-15 32.598-1.06943e-14 42 9.40202 42 21 42 32.598 32.598 42 21 42 9.40202 42-1.33679e-14 32.598 0 21Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 170.5 231.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.67358e-15 9.17816 9.40202-2.60992e-15 21-5.21985e-15 32.598-1.04397e-14 42 9.17816 42 20.5 42 31.8218 32.598 41 21 41 9.40202 41-1.33679e-14 31.8218 0 20.5Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 217.5 185.5)");
        selection.append("path")
            .attr("d", "M0 20.5C-2.60992e-15 9.17816 9.17816-2.60992e-15 20.5-5.21985e-15 31.8218-1.04397e-14 41 9.17816 41 20.5 41 31.8218 31.8218 41 20.5 41 9.17816 41-1.30496e-14 31.8218 0 20.5Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd")
            .attr("transform", "matrix(1 0 0 -1 265.5 200.5)");
    }

    function improvementLow(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#00B0F0")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(106.228 292) scale(10, 10)")
            .text("L");
        selection.append("path")
            .attr("d", "M95.4025 162.857 141.063 143.281 144.597 151.525 98.9371 171.101Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M149.897 145.496 193.618 169.089 189.358 176.983 145.638 153.39Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M199.882 171.677 235.443 206.367 229.18 212.788 193.618 178.098Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M238.113 209.566 284.671 192.233 287.8 200.639 241.243 217.972Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M76.5001 168.5C76.5001 156.902 85.6782 147.5 97.0001 147.5 108.322 147.5 117.5 156.902 117.5 168.5 117.5 180.098 108.322 189.5 97.0001 189.5 85.6782 189.5 76.5001 180.098 76.5001 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M123.5 150C123.5 138.678 132.678 129.5 144 129.5 155.322 129.5 164.5 138.678 164.5 150 164.5 161.322 155.322 170.5 144 170.5 132.678 170.5 123.5 161.322 123.5 150Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M170.5 168.5C170.5 156.902 179.902 147.5 191.5 147.5 203.098 147.5 212.5 156.902 212.5 168.5 212.5 180.098 203.098 189.5 191.5 189.5 179.902 189.5 170.5 180.098 170.5 168.5Z")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#7F7F7F")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M217.5 214C217.5 202.678 226.902 193.5 238.5 193.5 250.098 193.5 259.5 202.678 259.5 214 259.5 225.322 250.098 234.5 238.5 234.5 226.902 234.5 217.5 225.322 217.5 214Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M265.5 199C265.5 187.678 274.678 178.5 286 178.5 297.322 178.5 306.5 187.678 306.5 199 306.5 210.322 297.322 219.5 286 219.5 274.678 219.5 265.5 210.322 265.5 199Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "2.66667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#00B0F0")
            .attr("fill-rule", "evenodd");
    }

    function neutralHigh(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M103.652 242.245 180.02 165.878 151.735 137.593 258.273 119.68 240.359 226.217 212.075 197.933 135.708 274.3Z")
            .attr("fill", "#490092")
            .attr("fill-rule", "evenodd");
    }

    function neutralLow(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#490092")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M135.708 103.652 212.075 180.02 240.359 151.735 258.273 258.273 151.735 240.359 180.02 212.075 103.652 135.708Z")
            .attr("fill", "#490092")
            .attr("fill-rule", "evenodd");
    }

    function consistentFail(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#E46C0A")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(155.851 158) scale(10, 10)")
            .text("F");
        selection.append("path")
            .attr("d", "M38.5001 185.5 340.862 185.5")
            .attr("stroke", "#E46C0A")
            .attr("stroke-width", "8.66667")
            .attr("stroke-miterlimit", "8")
            .attr("stroke-dasharray", "26 8.66667")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "10.6667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
    }

    function consistentPass(selection) {
        selection.append("g")
            .attr("clip-path", "url(#clip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#clip4)")
            .append("path")
            .attr("d", "M17.47 172.83C17.47 86.9332 87.1031 17.3 173 17.3 258.897 17.3 328.53 86.9332 328.53 172.83 328.53 258.727 258.897 328.36 173 328.36 87.1031 328.36 17.47 258.727 17.47 172.83Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189C38 105.605 105.605 38 189 38 272.395 38 340 105.605 340 189 340 272.395 272.395 340 189 340 105.605 340 38 272.395 38 189Z")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#00B0F0")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(155.851 158) scale(10, 10)")
            .text("P");
        selection.append("path")
            .attr("d", "M55.5001 257.5 323.847 257.5")
            .attr("stroke", "#00B0F0")
            .attr("stroke-width", "8.66667")
            .attr("stroke-miterlimit", "8")
            .attr("stroke-dasharray", "26 8.66667")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M72.5001 238.762C89.0456 218.168 107.725 200.801 129.638 200.507 152.134 201.459 176.57 238.689 192.563 241.313 206.31 244.118 205.897 217.733 212.814 216.659 217.563 215.414 220.151 238.182 233.066 240.463 248.557 243.786 291.62 234.385 302.5 236.212")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "10.6667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
    }

    function inconsistent(selection) {
        const defs = selection.append("defs");
        defs.append("clipPath")
            .attr("id", "inconsistentClip2")
            .append("path")
            .attr("d", "M189 38C105.605 38 38 105.829 38 189.5 38 273.171 105.605 341 189 341 272.395 341 340 273.171 340 189.5 340 105.829 272.395 38 189 38ZM5.63264e-06 5.63264e-06 378 5.63264e-06 378 378 5.63264e-06 378Z")
            .attr("fill-rule", "evenodd")
            .attr("clip-rule", "evenodd");
        defs.append("clipPath")
            .attr("id", "inconsistentClip4")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "346")
            .attr("height", "347");
        selection.append("g")
            .attr("clip-path", "url(#inconsistentClip2)")
            .append("g")
            .attr("clip-path", "url(#clip3)")
            .attr("filter", "url(#fx0)")
            .attr("transform", "translate(16 25)")
            .append("g")
            .attr("clip-path", "url(#inconsistentClip4)")
            .append("path")
            .attr("d", "M17.47 173.345C17.47 87.1637 87.1031 17.3 173 17.3 258.897 17.3 328.53 87.1637 328.53 173.345 328.53 259.526 258.897 329.39 173 329.39 87.1031 329.39 17.47 259.526 17.47 173.345Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "21")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M38 189.5C38 105.829 105.605 38 189 38 272.395 38 340 105.829 340 189.5 340 273.171 272.395 341 189 341 105.605 341 38 273.171 38 189.5Z")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "20")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "#FFFFFF")
            .attr("fill-rule", "evenodd");
        selection.append("text")
            .attr("fill", "#7F7F7F")
            .attr("font-family", "Arial,Arial_MSFontService,sans-serif")
            .attr("font-weight", "700")
            .attr("font-size", "11.7")
            .attr("transform", "translate(155.851 158) scale(10, 10)")
            .text("?");
        selection.append("path")
            .attr("d", "M38.5001 222.5 340.862 222.5")
            .attr("stroke", "#A6A6A6")
            .attr("stroke-width", "8.66667")
            .attr("stroke-miterlimit", "8")
            .attr("stroke-dasharray", "26 8.66667")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
        selection.append("path")
            .attr("d", "M72.5001 239.762C89.0456 219.168 107.725 201.801 129.638 201.507 152.134 202.459 176.57 239.689 192.563 242.313 206.31 245.118 205.897 218.733 212.814 217.659 217.563 216.414 220.151 239.182 233.066 241.463 248.557 244.786 291.62 235.385 302.5 237.212")
            .attr("stroke", "#7F7F7F")
            .attr("stroke-width", "10.6667")
            .attr("stroke-miterlimit", "8")
            .attr("fill", "none")
            .attr("fill-rule", "evenodd");
    }

    const nhsIcons = {
        commonCause,
        concernHigh,
        concernLow,
        improvementHigh,
        improvementLow,
        neutralHigh,
        neutralLow,
        consistentFail,
        consistentPass,
        inconsistent
    };

    function iconTransformSpec(svg_width, svg_height, location, scaling, count) {
        const scaling_factor = (0.08 * (svg_height / 378)) * scaling;
        const icon_x = location.includes("Right")
            ? (svg_width / scaling_factor) - (378 + (count * 378))
            : (count * 378);
        const icon_y = location.includes("Bottom") ? (svg_height / scaling_factor) - 378 : 0;
        return `scale(${scaling_factor}) translate(${icon_x}, ${icon_y})`;
    }
    function initialiseIconSVG(selection, icon_name, transform_spec) {
        const icon_group = selection.append('g')
            .classed("icongroup", true);
        if (transform_spec) {
            icon_group.attr("transform", transform_spec);
        }
        const icon_defs = icon_group.append("defs");
        const icon_defs_filter = icon_defs.append("filter")
            .attr("id", "fx0")
            .attr("x", "-10%")
            .attr("y", "-10%")
            .attr("width", "120%")
            .attr("height", "120%")
            .attr("filterUnits", "userSpaceOnUse")
            .attr("primitiveUnits", "userSpaceOnUse");
        const icon_comptrans = icon_defs_filter.append("feComponentTransfer")
            .attr("color-interpolation-filters", "sRGB");
        icon_comptrans.append("feFuncR")
            .attr("type", "discrete")
            .attr("tableValues", "0 0");
        icon_comptrans.append("feFuncG")
            .attr("type", "discrete")
            .attr("tableValues", "0 0");
        icon_comptrans.append("feFuncB")
            .attr("type", "discrete")
            .attr("tableValues", "0 0");
        icon_comptrans.append("feFuncA")
            .attr("type", "linear")
            .attr("slope", "0.4")
            .attr("intercept", "0");
        icon_defs_filter.append("feGaussianBlur")
            .attr("stdDeviation", "1.77778 1.77778");
        icon_defs.append("clipPath")
            .attr("id", "clip1")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "378")
            .attr("height", "378");
        icon_defs.append("clipPath")
            .attr("id", "clip2")
            .append("path")
            .attr("d", "M189 38C105.605 38 38 105.605 38 189 38 272.395 105.605 340 189 340 272.395 340 340 272.395 340 189 340 105.605 272.395 38 189 38ZM5.63264e-06 5.63264e-06 378 5.63264e-06 378 378 5.63264e-06 378Z")
            .attr("fill-rule", "evenodd")
            .attr("clip-rule", "evenodd");
        icon_defs.append("clipPath")
            .attr("id", "clip3")
            .append("rect")
            .attr("x", "-2")
            .attr("y", "-2")
            .attr("width", "349")
            .attr("height", "349");
        icon_defs.append("clipPath")
            .attr("id", "clip4")
            .append("rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "346")
            .attr("height", "346");
        icon_group.append("g")
            .classed(icon_name, true)
            .attr("clip-path", "url(#clip1)");
    }

    function assuranceIconToDraw(controlLimits, inputSettings, derivedSettings) {
        if (!(derivedSettings.chart_type_props.has_control_limits)) {
            return "none";
        }
        const imp_direction = inputSettings.outliers.improvement_direction;
        const ll99 = controlLimits.ll99;
        const ul99 = controlLimits.ul99;
        if (!inputSettings.lines.show_alt_target || imp_direction === "neutral") {
            return "none";
        }
        const N = ll99.length - 1;
        const alt_target = controlLimits.alt_target[N];
        const upper = ul99[N];
        const lower = ll99[N];
        const impDirectionIncrease = imp_direction === "increase";
        if (alt_target === undefined || upper === undefined || lower === undefined) {
            return "none";
        }
        if (alt_target > upper) {
            return impDirectionIncrease ? "consistentFail" : "consistentPass";
        }
        if (alt_target < lower) {
            return impDirectionIncrease ? "consistentPass" : "consistentFail";
        }
        return "inconsistent";
    }

    function variationIconsToDraw(outliers, inputSettings) {
        const direction_icons = {
            increase: { improvement: "improvementHigh", deterioration: "concernLow" },
            decrease: { improvement: "improvementLow", deterioration: "concernHigh" }
        };
        const imp_direction = inputSettings.outliers.improvement_direction;
        const icons = imp_direction === "neutral" ? undefined : direction_icons[imp_direction];
        const flag_last = inputSettings.nhs_icons.flag_last_point;
        const startIndex = flag_last ? outliers.astpoint.length - 1 : 0;
        const patterns = [outliers.astpoint, outliers.shift, outliers.trend, outliers.two_in_three];
        let improvementPresent = false;
        let deteriorationPresent = false;
        let neutralLowPresent = false;
        let neutralHighPresent = false;
        for (let i = startIndex; i < outliers.astpoint.length; i++) {
            for (let p = 0; p < patterns.length; p++) {
                switch (patterns[p][i]) {
                    case "improvement":
                        improvementPresent = true;
                        break;
                    case "deterioration":
                        deteriorationPresent = true;
                        break;
                    case "neutral_low":
                        neutralLowPresent = true;
                        break;
                    case "neutral_high":
                        neutralHighPresent = true;
                        break;
                }
            }
            if (improvementPresent && deteriorationPresent && neutralLowPresent && neutralHighPresent) {
                break;
            }
        }
        const iconsPresent = [];
        if (improvementPresent && icons !== undefined) {
            iconsPresent.push(icons.improvement);
        }
        if (deteriorationPresent && icons !== undefined) {
            iconsPresent.push(icons.deterioration);
        }
        if (neutralLowPresent) {
            iconsPresent.push("neutralLow");
        }
        if (neutralHighPresent) {
            iconsPresent.push("neutralHigh");
        }
        if (iconsPresent.length === 0) {
            iconsPresent.push("commonCause");
        }
        return iconsPresent;
    }

    function drawIcons(selection, visualObj) {
        selection.selectAll(".icongroup").remove();
        if (!(visualObj.plotProperties.displayPlot)) {
            return;
        }
        const nhsIconSettings = visualObj.viewModel.inputSettings.settings[0].nhs_icons;
        const draw_variation = nhsIconSettings.show_variation_icons;
        const variation_location = nhsIconSettings.variation_icons_locations;
        const svg_width = visualObj.viewModel.svgWidth;
        const svg_height = visualObj.viewModel.svgHeight;
        let numVariationIcons = 0;
        if (draw_variation) {
            const variation_scaling = nhsIconSettings.variation_icons_scaling;
            const variationIconsPresent = variationIconsToDraw(visualObj.viewModel.outliers[0], visualObj.viewModel.inputSettings.settings[0]);
            for (let idx = 0; idx < variationIconsPresent.length; idx++) {
                const icon = variationIconsPresent[idx];
                selection
                    .call(initialiseIconSVG, icon, iconTransformSpec(svg_width, svg_height, variation_location, variation_scaling, idx))
                    .selectAll(`.${icon}`)
                    .call(nhsIcons[icon]);
            }
            numVariationIcons = variationIconsPresent.length;
        }
        const draw_assurance = nhsIconSettings.show_assurance_icons;
        if (draw_assurance) {
            const assurance_location = nhsIconSettings.assurance_icons_locations;
            const assurance_scaling = nhsIconSettings.assurance_icons_scaling;
            const settings = visualObj.viewModel.inputSettings.settings[0];
            const derivedSettings = visualObj.viewModel.inputSettings.derivedSettings[0];
            const assuranceIconPresent = assuranceIconToDraw(visualObj.viewModel.controlLimits[0], settings, derivedSettings);
            if (assuranceIconPresent === "none") {
                return;
            }
            const currIconCount = (numVariationIcons > 0 && variation_location === assurance_location)
                ? numVariationIcons
                : 0;
            selection
                .call(initialiseIconSVG, assuranceIconPresent, iconTransformSpec(svg_width, svg_height, assurance_location, assurance_scaling, currIconCount))
                .selectAll(`.${assuranceIconPresent}`)
                .call(nhsIcons[assuranceIconPresent]);
        }
    }

    const columnKinds = {
        value: "number", target: "number", alt_target: "number", trend_line: "number", speclimits_lower: "number", speclimits_upper: "number",
        ll99: "number", ll95: "number", ll68: "number", ul68: "number", ul95: "number", ul99: "number",
        numerator: "input", denominator: "input",
        date: "date", latest_date: "date",
        astpoint: "flag", trend: "flag", shift: "flag", two_in_three: "flag"
    };
    const iconKinds = { ...columnKinds, variation: "icon", assurance: "icon" };
    function drawsIcons(inputSettings, showGrouped) {
        return showGrouped && (inputSettings.nhs_icons.show_variation_icons || inputSettings.nhs_icons.show_assurance_icons);
    }
    const iconRowHeightRatio = 2.1875;
    function isIconColumn(column) {
        return column === "variation" || column === "assurance";
    }
    function rowTableSettings(row, tableSettings) {
        return ("table_body_bg_colour" in row.aesthetics) ? row.aesthetics : tableSettings;
    }
    function drawIconCells(selection, nhsIconSettings) {
        const allCells = selection.select(".table-body")
            .selectAll("tr")
            .selectAll("td");
        const allNodes = allCells.nodes();
        const allData = allCells.data();
        const cells = [];
        const data = [];
        for (let i = 0; i < allNodes.length; i++) {
            if (isIconColumn(allData[i].column)) {
                cells.push(allNodes[i]);
                data.push(allData[i]);
            }
        }
        const icons = new Array(cells.length);
        let rowHeight = Number.POSITIVE_INFINITY;
        const columnWidths = { variation: 0, assurance: 0 };
        const maxIcons = { variation: 0, assurance: 0 };
        for (let i = 0; i < cells.length; i++) {
            const column = data[i].column;
            const row = rendering.select(cells[i].parentElement).datum();
            const assurance = row.table_row.assurance;
            icons[i] = column === "variation" ? row.variation_icons : (assurance === "none" ? [] : [assurance]);
            maxIcons[column] = Math.max(maxIcons[column], icons[i].length);
            const style = getComputedStyle(cells[i]);
            const rect = cells[i].getBoundingClientRect();
            rowHeight = Math.min(rowHeight, rect.height
                - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
                - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth));
            columnWidths[column] = rect.width
                - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
                - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
        }
        const widthCap = (columnWidths.variation + columnWidths.assurance)
            / Math.max(1, maxIcons.variation + maxIcons.assurance);
        const baseSize = Math.min(rowHeight * iconRowHeightRatio, widthCap);
        for (let i = 0; i < cells.length; i++) {
            const variation = data[i].column === "variation";
            const scaling = variation ? nhsIconSettings.variation_icons_scaling : nhsIconSettings.assurance_icons_scaling;
            const size = baseSize * scaling;
            const cell = rendering.select(cells[i]);
            for (let j = 0; j < icons[i].length; j++) {
                const icon = icons[i][j];
                cell.append("svg")
                    .attr("width", `${size}px`)
                    .attr("height", `${size}px`)
                    .attr("viewBox", "0 0 378 378")
                    .style("vertical-align", "top")
                    .classed("rowsvg", true)
                    .call(initialiseIconSVG, icon)
                    .selectAll(".icongroup")
                    .selectAll(`.${icon}`)
                    .call(nhsIcons[icon]);
            }
        }
    }
    function drawSummaryTable(selection, visualObj) {
        const viewModel = visualObj.viewModel;
        const plotPoints = viewModel.showGrouped ? viewModel.groupedRows : viewModel.plotPoints;
        const inputSettings = viewModel.inputSettings.settings[0];
        const tableSettings = inputSettings.summary_table;
        const draw_icons = drawsIcons(inputSettings, viewModel.showGrouped);
        rendering.drawSummaryTable(selection, {
            columns: viewModel.tableColumns[0],
            rows: plotPoints,
            kinds: draw_icons ? iconKinds : columnKinds,
            settings: tableSettings,
            rowSettings: row => rowTableSettings(row, tableSettings),
            formatValue: viewModel.inputSettings.derivedSettings[0].formatValue,
            width: viewModel.svgWidth,
            host: visualObj.host,
            selectionManager: visualObj.selectionManager,
            onSelectionChange: () => visualObj.updateHighlighting()
        });
        if (plotPoints.length > 0 && draw_icons) {
            drawIconCells(selection, inputSettings.nhs_icons);
        }
    }

    function cLimits(args) {
        const n_sub = args.subset_points.length;
        const numerators = args.numerators;
        const subset_points = args.subset_points;
        let cl = 0;
        for (let i = 0; i < n_sub; i++) {
            cl += numerators[subset_points[i]];
        }
        cl = cl / n_sub;
        return {
            keys: args.keys,
            values: args.numerators,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: Math.sqrt(cl), floor: 0 })
        };
    }

    function gLimits(args) {
        const numerators = args.numerators;
        const subset_points = args.subset_points;
        const n_sub = subset_points.length;
        const numerator_subset = new Array(n_sub);
        let cl = 0;
        for (let i = 0; i < n_sub; i++) {
            const curr_numerator = numerators[subset_points[i]];
            numerator_subset[i] = curr_numerator;
            cl += curr_numerator;
        }
        cl /= n_sub;
        return {
            keys: args.keys,
            values: args.numerators,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: Math.sqrt(cl * (cl + 1)), target: math.median(numerator_subset), floor: 0 })
        };
    }

    function averageMovingRange(consec_diff, outliers_in_limits) {
        let amr = 0;
        for (let i = 0; i < consec_diff.length; i++) {
            amr += consec_diff[i];
        }
        amr /= consec_diff.length;
        if (!outliers_in_limits && amr > 0) {
            const consec_diff_ulim = amr * 3.267;
            let screened_amr = 0;
            let screened_count = 0;
            for (let i = 0; i < consec_diff.length; i++) {
                if (consec_diff[i] < consec_diff_ulim) {
                    screened_amr += consec_diff[i];
                    screened_count += 1;
                }
            }
            amr = screened_amr / screened_count;
        }
        return amr;
    }

    function plottedValues(args) {
        const numerators = args.numerators;
        const denominators = args.denominators;
        if (denominators === undefined) {
            return { values: numerators };
        }
        const values = new Array(numerators.length);
        for (let i = 0; i < values.length; i++) {
            values[i] = numerators[i] / denominators[i];
        }
        return { values, numerators, denominators };
    }

    function iCentreAndSigma(values, subset_points, outliers_in_limits) {
        const n_sub = subset_points.length;
        let prevVal = values[subset_points[0]];
        let cl = prevVal;
        const consec_diff = new Array(n_sub - 1);
        for (let i = 1; i < n_sub; i++) {
            const currVal = values[subset_points[i]];
            consec_diff[i - 1] = Math.abs(currVal - prevVal);
            cl += currVal;
            prevVal = currVal;
        }
        return { cl: cl / n_sub, sigma: averageMovingRange(consec_diff, outliers_in_limits) / 1.128 };
    }
    function iLimits(args) {
        const plotted = plottedValues(args);
        const { cl, sigma } = iCentreAndSigma(plotted.values, args.subset_points, args.outliers_in_limits);
        return {
            keys: args.keys,
            ...plotted,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma })
        };
    }

    function subsetMovingRanges(values, subset_points) {
        const n_sub = subset_points.length;
        const subset = new Array(n_sub);
        const ranges = new Array(n_sub - 1);
        subset[0] = values[subset_points[0]];
        for (let i = 1; i < n_sub; i++) {
            subset[i] = values[subset_points[i]];
            ranges[i - 1] = Math.abs(subset[i] - subset[i - 1]);
        }
        return { subset, ranges };
    }

    function imLimits(args) {
        const plotted = plottedValues(args);
        const { subset, ranges: consec_diff } = subsetMovingRanges(plotted.values, args.subset_points);
        const cl = math.median(subset);
        const sigma = averageMovingRange(consec_diff, args.outliers_in_limits) / 1.128;
        return {
            keys: args.keys,
            ...plotted,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma })
        };
    }

    function immLimits(args) {
        const plotted = plottedValues(args);
        const { subset, ranges: consec_diff } = subsetMovingRanges(plotted.values, args.subset_points);
        const cl = math.median(subset);
        let mmr = math.median(consec_diff);
        if (!args.outliers_in_limits) {
            const consec_diff_ulim = mmr * 3.865;
            const valid_diffs = [];
            for (let i = 0; i < consec_diff.length; i++) {
                if (consec_diff[i] < consec_diff_ulim) {
                    valid_diffs.push(consec_diff[i]);
                }
            }
            if (valid_diffs.length > 0) {
                mmr = math.median(valid_diffs);
            }
        }
        return {
            keys: args.keys,
            ...plotted,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: mmr / 0.954 })
        };
    }

    function mrLimits(args) {
        const plotted = plottedValues(args);
        const values = plotted.values;
        const n_sub = args.subset_points.length;
        const n_mr = args.keys.length - 1;
        const subset_points = args.subset_points;
        let cl = 0;
        for (let i = 1; i < n_sub; i++) {
            cl += Math.abs(values[subset_points[i]] - values[subset_points[i - 1]]);
        }
        cl /= (n_sub - 1);
        const sigma = 3.267 / 3;
        const ul68 = cl * sigma;
        const ul95 = cl * (2 * sigma);
        const ul99 = cl * (3 * sigma);
        const ranges = new Array(n_mr);
        const limits = {
            target: new Array(n_mr),
            ll99: new Array(n_mr),
            ll95: new Array(n_mr),
            ll68: new Array(n_mr),
            ul68: new Array(n_mr),
            ul95: new Array(n_mr),
            ul99: new Array(n_mr)
        };
        for (let i = 0; i < n_mr; i++) {
            ranges[i] = Math.abs(values[i + 1] - values[i]);
            limits.target[i] = cl;
            limits.ll99[i] = 0;
            limits.ll95[i] = 0;
            limits.ll68[i] = 0;
            limits.ul68[i] = ul68;
            limits.ul95[i] = ul95;
            limits.ul99[i] = ul99;
        }
        return {
            keys: args.keys.slice(1),
            values: ranges,
            numerators: plotted.numerators?.slice(1),
            denominators: plotted.denominators?.slice(1),
            ...limits
        };
    }

    function subsetRatio(numerators, denominators, subset_points) {
        let sum_numerators = 0;
        let sum_denominators = 0;
        for (let i = 0; i < subset_points.length; i++) {
            sum_numerators += numerators[subset_points[i]];
            sum_denominators += denominators[subset_points[i]];
        }
        return sum_numerators / sum_denominators;
    }

    function pLimits(args) {
        const denominators = args.denominators;
        const cl = subsetRatio(args.numerators, denominators, args.subset_points);
        const cl_mult = cl * (1 - cl);
        return {
            keys: args.keys,
            ...plottedValues(args),
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: i => Math.sqrt(cl_mult / denominators[i]), floor: 0, ceiling: 1 })
        };
    }

    function laneySigmaMultiplier(values, cl, sd, subset_points, outliers_in_limits) {
        const consec_diff = new Array(subset_points.length - 1);
        let prevZ = (values[subset_points[0]] - cl) / sd[subset_points[0]];
        for (let i = 1; i < subset_points.length; i++) {
            const currZ = (values[subset_points[i]] - cl) / sd[subset_points[i]];
            consec_diff[i - 1] = Math.abs(currZ - prevZ);
            prevZ = currZ;
        }
        return averageMovingRange(consec_diff, outliers_in_limits) / 1.128;
    }

    function pprimeLimits(args) {
        const n = args.keys.length;
        const denominators = args.denominators;
        const subset_points = args.subset_points;
        const cl = subsetRatio(args.numerators, denominators, subset_points);
        const plotted = plottedValues(args);
        if (cl === 0 || cl === 1) {
            return { keys: args.keys, ...plotted, ...spc.sigmaLimits(n, cl, { sigma: 0, floor: 0, ceiling: 1 }) };
        }
        const cl_mult = cl * (1 - cl);
        const sd = new Array(n);
        for (let i = 0; i < n; i++) {
            sd[i] = Math.sqrt(cl_mult / denominators[i]);
        }
        const sigma_multiplier = laneySigmaMultiplier(plotted.values, cl, sd, subset_points, args.outliers_in_limits);
        return {
            keys: args.keys,
            ...plotted,
            ...spc.sigmaLimits(n, cl, { sigma: i => sd[i] * sigma_multiplier, floor: 0, ceiling: 1 })
        };
    }

    function withinGroupSd(group_sd, count_per_group, subset_points) {
        let varying = false;
        for (let i = 1; i < count_per_group.length; i++) {
            if (count_per_group[i] !== count_per_group[0]) {
                varying = true;
                break;
            }
        }
        const n_sub = subset_points.length;
        let sd_sum = 0;
        let weight_sum = 0;
        for (let i = 0; i < n_sub; i++) {
            const curr_sd = group_sd[subset_points[i]];
            if (varying) {
                const Nm1 = count_per_group[subset_points[i]] - 1;
                sd_sum += Nm1 * curr_sd * curr_sd;
                weight_sum += Nm1;
            }
            else {
                sd_sum += curr_sd;
                weight_sum += 1;
            }
        }
        return varying ? Math.sqrt(sd_sum / weight_sum) : sd_sum / weight_sum;
    }

    function sLimits(args) {
        const group_sd = args.numerators;
        const count_per_group = args.denominators;
        const cl = withinGroupSd(group_sd, count_per_group, args.subset_points);
        return {
            keys: args.keys,
            values: args.numerators,
            denominators: args.denominators,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: i => cl * (math.c5(count_per_group[i]) / math.c4(count_per_group[i])), floor: 0 })
        };
    }

    function tLimits(args) {
        const n = args.keys.length;
        const transformed = new Array(n);
        for (let i = 0; i < n; i++) {
            transformed[i] = Math.pow(args.numerators[i], 1 / 3.6);
        }
        const { cl, sigma } = iCentreAndSigma(transformed, args.subset_points, args.outliers_in_limits);
        const back = (value) => Math.pow(value, 3.6);
        const backLower = (value) => value < 0 ? 0 : back(value);
        const target = back(cl);
        const ll99 = backLower(cl - 3 * sigma);
        const ll95 = backLower(cl - 2 * sigma);
        const ll68 = backLower(cl - sigma);
        const ul68 = back(cl + sigma);
        const ul95 = back(cl + 2 * sigma);
        const ul99 = back(cl + 3 * sigma);
        const limits = {
            target: new Array(n),
            ll99: new Array(n),
            ll95: new Array(n),
            ll68: new Array(n),
            ul68: new Array(n),
            ul95: new Array(n),
            ul99: new Array(n)
        };
        for (let i = 0; i < n; i++) {
            limits.target[i] = target;
            limits.ll99[i] = ll99;
            limits.ll95[i] = ll95;
            limits.ll68[i] = ll68;
            limits.ul68[i] = ul68;
            limits.ul95[i] = ul95;
            limits.ul99[i] = ul99;
        }
        return { keys: args.keys, values: args.numerators, ...limits };
    }

    function uLimits(args) {
        const denominators = args.denominators;
        const cl = subsetRatio(args.numerators, denominators, args.subset_points);
        return {
            keys: args.keys,
            ...plottedValues(args),
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: i => Math.sqrt(cl / denominators[i]), floor: 0 })
        };
    }

    function uprimeLimits(args) {
        const n = args.keys.length;
        const denominators = args.denominators;
        const subset_points = args.subset_points;
        const cl = subsetRatio(args.numerators, denominators, subset_points);
        const plotted = plottedValues(args);
        if (cl === 0) {
            return { keys: args.keys, ...plotted, ...spc.sigmaLimits(n, cl, { sigma: 0, floor: 0 }) };
        }
        const sd = new Array(n);
        for (let i = 0; i < n; i++) {
            sd[i] = Math.sqrt(cl / denominators[i]);
        }
        const sigma_multiplier = laneySigmaMultiplier(plotted.values, cl, sd, subset_points, args.outliers_in_limits);
        return {
            keys: args.keys,
            ...plotted,
            ...spc.sigmaLimits(n, cl, { sigma: i => sd[i] * sigma_multiplier, floor: 0 })
        };
    }

    function xbarLimits(args) {
        const count_per_group = args.denominators;
        const group_means = args.numerators;
        const group_sd = args.xbar_sds;
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        let weighted_mean_sum = 0;
        let total_count = 0;
        for (let i = 0; i < n_sub; i++) {
            const curr_count = count_per_group[subset_points[i]];
            weighted_mean_sum += curr_count * group_means[subset_points[i]];
            total_count += curr_count;
        }
        const sd = withinGroupSd(group_sd, count_per_group, subset_points);
        const cl = weighted_mean_sum / total_count;
        return {
            keys: args.keys,
            values: args.numerators,
            ...spc.sigmaLimits(args.keys.length, cl, { sigma: i => (math.a3(count_per_group[i]) * sd) / 3 }),
            denominators: args.denominators,
            xbar_sds: args.xbar_sds
        };
    }

    function runLimits(args) {
        const plotted = plottedValues(args);
        const n_sub = args.subset_points.length;
        const subset_points = args.subset_points;
        const ratio_subset = new Array(n_sub);
        for (let i = 0; i < n_sub; i++) {
            ratio_subset[i] = plotted.values[subset_points[i]];
        }
        return {
            keys: args.keys,
            ...plotted,
            target: math.rep(math.median(ratio_subset), args.keys.length)
        };
    }

    var limitFunctions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        c: cLimits,
        g: gLimits,
        i: iLimits,
        i_m: imLimits,
        i_mm: immLimits,
        mr: mrLimits,
        p: pLimits,
        pp: pprimeLimits,
        run: runLimits,
        s: sLimits,
        t: tLimits,
        u: uLimits,
        up: uprimeLimits,
        xbar: xbarLimits
    });

    const spcSettings = {
        description: "SPC Settings",
        displayName: "Data Settings",
        settingsGroups: {
            "all": {
                chart_type: settings.dropdownOption("Chart Type", "Type of control chart; see Chart Types for the inputs each needs.", "i", ["run", "i", "i_m", "i_mm", "mr", "p", "pp", "u", "up", "c", "xbar", "s", "g", "t"], "none", [
                    "run - Run Chart",
                    "i - Individual Measurements",
                    "i_m - Individual Measurements: Median centerline",
                    "i_mm - Individual Measurements: Median centerline, Median MR Limits",
                    "mr - Moving Range of Individual Measurements",
                    "p - Proportions",
                    "p prime - Proportions: Large-Sample Corrected",
                    "u - Rates",
                    "u prime - Rates: Large-Sample Correction",
                    "c - Counts",
                    "xbar - Sample Means",
                    "s - Sample SDs",
                    "g - Number of Non-Events Between Events",
                    "t - Time Between Events"
                ]),
                outliers_in_limits: settings.toggleOption("Keep Outliers in Limit Calcs.", "Keeps unusually large moving ranges when calculating limits; off drops them first. "
                    + "Applies to i, i_m, i_mm, t, p prime and u prime charts.", false),
                ...settings.scalingOptions(),
                split_on_click: settings.toggleOption("Split Limits on Click", "Clicking a point ends a limit period there; clicking it again removes the split. "
                    + "Splits stay when this is turned off, and are ignored when Grouping (Summary Table) is used.", false),
                num_points_subset: settings.numberOption("Subset Number of Points for Limit Calculations", "Calculates the first period's limits from only this many points; blank or out of range uses them all.", undefined, { min: 1, integer: true }),
                subset_points_from: settings.dropdownOption("Subset Points From", "Whether the subset is taken from the start or end of the period.", "Start", ["Start", "End"]),
                subset_rebaselines: settings.toggleOption("Subset Points After Each Re-Baseline", "Applies the subset to every rebaseline period, not only the first.", false),
                ttip_show_date: settings.toggleOption("Show Date in Tooltip", "Shows the date, or the point number for g and t charts, in the tooltip.", true),
                ttip_label_date: settings.textOption("Date Tooltip Label", "Name for the date in the tooltip; Automatic uses Date, or Event for g and t charts.", "Automatic"),
                ...settings.valueTooltipOptions(),
                ...settings.limitTruncationOptions()
            }
        }
    };

    const outliersSettings = {
        description: "Outlier Settings",
        displayName: "Outlier Settings",
        settingsGroups: {
            "General": settings.flagDirectionOptions(),
            "Astronomical Points": {
                astronomical: settings.toggleOption("Highlight Astronomical Points", "Flags points beyond the chosen limit.", false),
                astronomical_limit: settings.dropdownOption("Limit for Astronomical Points", "Limit a point must be beyond. Specification needs the specification lines shown.", "3 Sigma", ["1 Sigma", "2 Sigma", "3 Sigma", "Specification"]),
                ast_colour_improvement: settings.colourOption("Imp. Ast. Colour", "Colour for astronomical points that are an improvement.", "improvement"),
                ast_colour_deterioration: settings.colourOption("Det. Ast. Colour", "Colour for astronomical points that are a deterioration.", "deterioration"),
                ast_colour_neutral_low: settings.colourOption("Neutral (Low) Ast. Colour", "Colour for points beyond the lower limit when the improvement direction is neutral.", "neutral_low"),
                ast_colour_neutral_high: settings.colourOption("Neutral (High) Ast. Colour", "Colour for points beyond the upper limit when the improvement direction is neutral.", "neutral_high")
            },
            "Shifts": {
                shift: settings.toggleOption("Highlight Shifts", "Flags runs of points on one side of the centreline.", false),
                shift_n: settings.numberOption("Shift Points", "Points needed for a shift; points on the centreline neither count nor break it.", 7, { min: 1, integer: true }),
                shift_colour_improvement: settings.colourOption("Imp. Shift Colour", "Colour for shifts that are an improvement.", "improvement"),
                shift_colour_deterioration: settings.colourOption("Det. Shift Colour", "Colour for shifts that are a deterioration.", "deterioration"),
                shift_colour_neutral_low: settings.colourOption("Neutral (Low) Shift Colour", "Colour for shifts below the centreline when the improvement direction is neutral.", "neutral_low"),
                shift_colour_neutral_high: settings.colourOption("Neutral (High) Shift Colour", "Colour for shifts above the centreline when the improvement direction is neutral.", "neutral_high")
            },
            "Trends": {
                trend: settings.toggleOption("Highlight Trends", "Flags runs of steadily rising or falling points.", false),
                trend_n: settings.numberOption("Trend Points", "Points needed for a trend, including its first; repeated values count once.", 5, { min: 2, integer: true }),
                trend_colour_improvement: settings.colourOption("Imp. Trend Colour", "Colour for trends that are an improvement.", "improvement"),
                trend_colour_deterioration: settings.colourOption("Det. Trend Colour", "Colour for trends that are a deterioration.", "deterioration"),
                trend_colour_neutral_low: settings.colourOption("Neutral (Low) Trend Colour", "Colour for falling trends when the improvement direction is neutral.", "neutral_low"),
                trend_colour_neutral_high: settings.colourOption("Neutral (High) Trend Colour", "Colour for rising trends when the improvement direction is neutral.", "neutral_high")
            },
            "Two-In-Three": {
                two_in_three: settings.toggleOption("Highlight Two-in-Three", "Flags two of three consecutive points beyond the same warning limit.", false),
                two_in_three_highlight_series: settings.toggleOption("Highlight all in Pattern", "Also flags the third point in the window, unless it is beyond the opposite limit.", false),
                two_in_three_limit: settings.dropdownOption("Warning Limit for Two-in-Three", "Limit the points must be beyond. Specification needs the specification lines shown.", "2 Sigma", ["1 Sigma", "2 Sigma", "3 Sigma", "Specification"]),
                twointhree_colour_improvement: settings.colourOption("Imp. Two-in-Three Colour", "Colour for two-in-three points that are an improvement.", "improvement"),
                twointhree_colour_deterioration: settings.colourOption("Det. Two-in-Three Colour", "Colour for two-in-three points that are a deterioration.", "deterioration"),
                twointhree_colour_neutral_low: settings.colourOption("Neutral (Low) Two-in-Three Colour", "Colour for two-in-three patterns at the lower limit when the improvement direction is neutral.", "neutral_low"),
                twointhree_colour_neutral_high: settings.colourOption("Neutral (High) Two-in-Three Colour", "Colour for two-in-three patterns at the upper limit when the improvement direction is neutral.", "neutral_high")
            }
        }
    };

    const iconLocations = ["Top Right", "Bottom Right", "Top Left", "Bottom Left"];
    const nhsIconsSettings = {
        description: "NHS Icons Settings",
        displayName: "NHS Icons Settings",
        settingsGroups: {
            "all": {
                show_variation_icons: settings.toggleOption("Show Variation Icons", "Draws the NHS variation icons for the flagged points, or adds them as a summary table column.", false),
                flag_last_point: settings.toggleOption("Flag Only Last Point", "Bases the variation icons on the last point only; off uses every point.", true),
                variation_icons_locations: settings.dropdownOption("Variation Icon Locations", "Corner of the chart for the variation icons.", "Top Right", iconLocations),
                variation_icons_scaling: settings.numberOption("Scale Variation Icon Size", "Multiplies the size of the variation icons.", 1, { min: 0 }),
                show_assurance_icons: settings.toggleOption("Show Assurance Icons", "Draws the NHS assurance icon, comparing the alt. target with the last point's three-sigma limits. "
                    + "Needs the alt. target line and an increase or decrease improvement direction.", false),
                assurance_icons_locations: settings.dropdownOption("Assurance Icon Locations", "Corner of the chart for the assurance icon.", "Top Right", iconLocations),
                assurance_icons_scaling: settings.numberOption("Scale Assurance Icon Size", "Multiplies the size of the assurance icon.", 1, { min: 0 })
            }
        }
    };

    const scatterSettings = {
        description: "Scatter Settings",
        displayName: "Scatter Settings",
        settingsGroups: {
            "all": {
                show_dots: settings.toggleOption("Show Scatter", "Draws the points.", true),
                ...settings.dotOptions()
            }
        }
    };

    const linesSettings = {
        description: "Line Settings",
        displayName: "Line Settings",
        settingsGroups: {
            "Main": settings.createLineGroup("main", {
                showLabel: "Show Main Line",
                showDescription: "Draws the line joining the points.",
                showDefault: true,
                namePrefix: "Main ",
                width: 1,
                type: "10 0",
                colour: "common_cause",
                rebaselines: true
            }),
            "Target": settings.createLineGroup("target", {
                showLabel: "Show Target",
                showDescription: "Draws the centreline.",
                showDefault: true,
                width: 1.5,
                type: "10 0",
                colour: "standard",
                rebaselines: true,
                tooltipLabel: "Centerline"
            }),
            "Alt. Target": settings.createLineGroup("alt_target", {
                showLabel: "Show Alt. Target Line",
                showDescription: "Draws a line at the Additional Target Value; the assurance icon needs it.",
                showDefault: false,
                width: 1.5,
                type: "10 0",
                colour: "standard",
                rebaselines: true,
                tooltipLabel: "Alt. Target"
            }, {
                alt_target: settings.numberOption("Additional Target Value:", "Value of the target line, as a plotted value unless the multiplier is applied.", undefined),
                multiplier_alt_target: settings.toggleOption("Apply Multiplier to Alt. Target", "Multiplies the target by the Multiplier, for targets entered as raw proportions or rates.", false)
            }),
            "68% Limits": settings.createLineGroup("68", {
                showLabel: "Show 68% Lines",
                showDescription: "Draws the one-sigma lines.",
                showDefault: false,
                width: 2,
                type: "2 5",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "68% Limit",
                tooltipPrefixes: true
            }),
            "95% Limits": settings.createLineGroup("95", {
                showLabel: "Show 95% Lines",
                showDescription: "Draws the two-sigma lines.",
                showDefault: true,
                width: 2,
                type: "2 5",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "95% Limit",
                tooltipPrefixes: true
            }),
            "99% Limits": settings.createLineGroup("99", {
                showLabel: "Show 99% Lines",
                showDescription: "Draws the three-sigma control limits.",
                showDefault: true,
                width: 2,
                type: "10 10",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "99% Limit",
                tooltipPrefixes: true
            }),
            "Specification Limits": settings.createLineGroup("specification", {
                showLabel: "Show Specification Lines",
                showDescription: "Draws the specification limits, which patterns using the Specification limit need.",
                showDefault: false,
                width: 2,
                type: "10 10",
                colour: "limits",
                rebaselines: true,
                tooltipLabel: "Specification Limit",
                tooltipPrefixes: true
            }, {
                specification_upper: settings.numberOption("Upper Specification Limit:", "Upper specification limit, as a plotted value unless the multiplier is applied.", undefined),
                specification_lower: settings.numberOption("Lower Specification Limit:", "Lower specification limit, as a plotted value unless the multiplier is applied.", undefined),
                multiplier_specification: settings.toggleOption("Apply Multiplier to Specification Limits", "Multiplies the limits by the Multiplier, for limits entered as raw proportions or rates.", false)
            }),
            "Trend": settings.createLineGroup("trend", {
                showLabel: "Show Trend",
                showDescription: "Draws a least-squares trend line through each rebaseline period.",
                showDefault: false,
                width: 1.5,
                type: "10 0",
                colour: "common_cause",
                rebaselines: true,
                tooltipLabel: "Trend"
            })
        }
    };

    const datesSettings = {
        description: "Date Settings",
        displayName: "Date Settings",
        settingsGroups: {
            "all": {
                date_format_day: settings.dropdownOption("Day Format", "How the day appears in date labels; (blank) leaves it out.", "DD", ["DD", "Thurs DD", "Thursday DD", "(blank)"]),
                date_format_month: settings.dropdownOption("Month Format", "How the month appears in date labels; (blank) leaves it out.", "MM", ["MM", "Mon", "Month", "(blank)"]),
                date_format_year: settings.dropdownOption("Year Format", "How the year appears in date labels; (blank) leaves it out.", "YYYY", ["YYYY", "YY", "(blank)"]),
                date_format_delim: settings.dropdownOption("Delimiter", "Character between the parts of a date label.", "/", ["/", "-", " "]),
                date_format_locale: settings.dropdownOption("Locale", "Order of the parts: en-GB puts the day first, en-US the month.", "en-GB", ["en-GB", "en-US"])
            }
        }
    };

    const summaryTableSettings = settings.createSummaryTableCard({
        showDescription: "Shows the points as a table instead of a chart. Data with more than one summary table group "
            + "is always shown as a table."
    }, {
        table_variation_filter: settings.dropdownOption("Filter by Variation Type", "Shows only the groups whose variation icon matches.", "all", ["all", "common", "special", "improvement", "deterioration", "neutral"], "none", [
            "All", "Common Cause", "Special Cause - Any", "Special Cause - Improvement",
            "Special Cause - Deterioration", "Special Cause - Neutral"
        ]),
        table_assurance_filter: settings.dropdownOption("Filter by Assurance Type", "Shows only the groups whose assurance icon matches.", "all", ["all", "any", "pass", "fail", "inconsistent"], "none", ["All", "Consistent - Any", "Consistent Pass", "Consistent Fail", "Inconsistent"])
    });

    const settingsModel = {
        canvas: settings.createCanvasCard(),
        spc: settings.defineCard(spcSettings),
        outliers: settings.defineCard(outliersSettings),
        nhs_icons: settings.defineCard(nhsIconsSettings),
        scatter: settings.defineCard(scatterSettings),
        lines: settings.defineCard(linesSettings),
        x_axis: settings.createAxisCard("x", { tickRotation: -35, limitUnits: "a point number counted from 0" }),
        y_axis: settings.createAxisCard("y", { tickRotation: 0, limitUnits: "a plotted value" }, {
            limit_multiplier: settings.numberOption("Axis Scaling Factor", "Extends the y-axis past the centreline by this multiple of the distance to the furthest point, limit or target.", 1.5, { above: 0 })
        }),
        dates: settings.defineCard(datesSettings),
        summary_table: settings.defineCard(summaryTableSettings),
        download_options: settings.createDownloadCard(),
        labels: settings.createLabelsCard()
    };
    const defaultSettings = settings.createDefaultValues(settingsModel);

    const valueNames = {
        "i": "Observation",
        "i_m": "Observation",
        "i_mm": "Observation",
        "c": "Count",
        "t": "Time",
        "xbar": "Group Mean",
        "s": "Group SD",
        "g": "Non-Events",
        "run": "Observation",
        "mr": "Moving Range",
        "p": "Proportion",
        "pp": "Proportion",
        "u": "Rate",
        "up": "Rate"
    };
    class derivedSettingsClass {
        constructor(inputSettingsSpc) {
            const chartType = inputSettingsSpc.chart_type;
            this.chart_type_props = {
                name: chartType,
                needs_denominator: ["p", "pp", "u", "up", "xbar", "s"].includes(chartType),
                denominator_optional: ["i", "i_m", "i_mm", "run", "mr"].includes(chartType),
                numerator_non_negative: ["p", "pp", "u", "up", "s", "c", "g", "t"].includes(chartType),
                numerator_leq_denominator: ["p", "pp"].includes(chartType),
                has_control_limits: !(["run"].includes(chartType)),
                needs_sd: ["xbar"].includes(chartType),
                integer_values: ["c", "g"].includes(chartType),
                value_name: valueNames[chartType],
                x_axis_use_date: !(["g", "t"].includes(chartType)),
                date_name: !(["g", "t"].includes(chartType)) ? "Date" : "Event",
                denominator_gt_one: ["xbar", "s"].includes(chartType)
            };
            const scaling = data.deriveScaling(inputSettingsSpc, {
                proportion: this.chart_type_props.numerator_leq_denominator,
                percentAllowed: true
            });
            this.multiplier = scaling.multiplier;
            this.percentLabels = scaling.percentLabels;
            this.formatValue = scaling.formatValue;
        }
    }

    const movingRangeCharts = new Set(["i", "i_m", "i_mm", "mr", "t", "pp", "up"]);
    const rules = [
        settings => {
            const patterns = settings.outliers;
            if (settings.nhs_icons.show_variation_icons && !patterns.astronomical && !patterns.shift && !patterns.trend && !patterns.two_in_three) {
                return "Variation icons require at least one outlier pattern to be selected";
            }
            return undefined;
        },
        settings => {
            const outliers = settings.outliers;
            const flagsOnSpecification = (outliers.astronomical && outliers.astronomical_limit === "Specification")
                || (outliers.two_in_three && outliers.two_in_three_limit === "Specification");
            if (flagsOnSpecification && !settings.lines.show_specification) {
                return "Flagging against specification limits requires the specification lines to be shown";
            }
            return undefined;
        },
        settings$1 => settings.orderedBoundsError(settings$1, settings$1.spc),
        settings => {
            if (settings.spc.num_points_subset === 1 && movingRangeCharts.has(settings.spc.chart_type)) {
                return "Moving range limits require a subset of at least 2 points";
            }
            return undefined;
        }
    ];
    class settingsClass extends powerbi.SettingsStore {
        constructor() {
            super(settingsModel, settings => new derivedSettingsClass(settings.spc), rules);
        }
    }

    function buildTooltip(table_row, inputTooltips, inputSettings, derivedSettings) {
        const ast_limit = inputSettings.outliers.astronomical_limit;
        const two_in_three_limit = inputSettings.outliers.two_in_three_limit;
        const formatValues = derivedSettings.formatValue;
        const tooltip = new Array();
        if (inputSettings.spc.ttip_show_date) {
            const ttip_label_date = inputSettings.spc.ttip_label_date;
            tooltip.push({
                displayName: ttip_label_date === "Automatic" ? derivedSettings.chart_type_props.date_name : ttip_label_date,
                value: table_row.date
            });
        }
        tooltip.push(...powerbi.valueTooltips(inputSettings.spc, table_row, derivedSettings.chart_type_props.value_name, formatValues));
        if (!data.isNullOrUndefined(table_row.xbar_sd)) {
            tooltip.push({ displayName: "SD", value: formatValues(table_row.xbar_sd, "input") });
        }
        if (inputSettings.lines.ttip_show_trend && inputSettings.lines.show_trend) {
            tooltip.push({
                displayName: inputSettings.lines.ttip_label_trend,
                value: formatValues(table_row.trend_line, "value")
            });
        }
        if (inputSettings.lines.show_specification && inputSettings.lines.ttip_show_specification) {
            if (!data.isNullOrUndefined(table_row.speclimits_upper)) {
                tooltip.push({
                    displayName: `${inputSettings.lines.ttip_label_specification_prefix_upper}${inputSettings.lines.ttip_label_specification}`,
                    value: formatValues(table_row.speclimits_upper, "value")
                });
            }
            if (!data.isNullOrUndefined(table_row.speclimits_lower)) {
                tooltip.push({
                    displayName: `${inputSettings.lines.ttip_label_specification_prefix_lower}${inputSettings.lines.ttip_label_specification}`,
                    value: formatValues(table_row.speclimits_lower, "value")
                });
            }
        }
        tooltip.push(...powerbi.limitTooltips(inputSettings.lines, table_row, formatValues, derivedSettings.chart_type_props.has_control_limits));
        const patterns = new Array();
        if (table_row.astpoint !== "none") {
            let flag_text = "Astronomical Point";
            if (ast_limit !== "3 Sigma") {
                flag_text = `${flag_text} (${ast_limit})`;
            }
            patterns.push(flag_text);
        }
        if (table_row.trend !== "none") {
            patterns.push("Trend");
        }
        if (table_row.shift !== "none") {
            patterns.push("Shift");
        }
        if (table_row.two_in_three !== "none") {
            let flag_text = "Two-in-Three";
            if (two_in_three_limit !== "2 Sigma") {
                flag_text = `${flag_text} (${two_in_three_limit})`;
            }
            patterns.push(flag_text);
        }
        powerbi.appendPatternTooltips(tooltip, patterns, inputTooltips);
        return tooltip;
    }

    const weekdayDateMap = {
        "DD": null,
        "Thurs DD": "short",
        "Thursday DD": "long",
        "(blank)": null
    };
    const monthDateMap = {
        "MM": "2-digit",
        "Mon": "short",
        "Month": "long",
        "(blank)": null
    };
    const yearDateMap = {
        "YYYY": "numeric",
        "YY": "2-digit",
        "(blank)": null
    };
    const dayDateMap = {
        "DD": "2-digit",
        "Thurs DD": "2-digit",
        "Thursday DD": "2-digit",
        "(blank)": null
    };
    const dateOptionsLookup = {
        "weekday": weekdayDateMap,
        "day": dayDateMap,
        "month": monthDateMap,
        "year": yearDateMap
    };
    function dateSettingsToFormatOptions(date_settings) {
        const formatOpts = new Array();
        const keys = Object.keys(date_settings);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key !== "date_format_locale" && key !== "date_format_delim") {
                const formattedKey = key.replace("date_format_", "");
                const lookup = dateOptionsLookup[formattedKey];
                const dateSettingValue = date_settings[key];
                const val = lookup[dateSettingValue];
                if (!data.isNullOrUndefined(val)) {
                    formatOpts.push([formattedKey, val]);
                    if (formattedKey === "day" && dateSettingValue !== "DD" && !data.isNullOrUndefined(weekdayDateMap[dateSettingValue])) {
                        formatOpts.push(["weekday", weekdayDateMap[dateSettingValue]]);
                    }
                }
            }
        }
        return Object.fromEntries(formatOpts);
    }

    const monthNameToNumber = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    function readDatePart(parts, inputType, inputValue) {
        if (inputType?.temporal == null || data.isNullOrUndefined(inputValue)) {
            return;
        }
        if (inputType.category === "DayOfMonth") {
            parts.day = (inputValue);
        }
        else if (inputType.category === "Months") {
            parts.month = monthNameToNumber[(inputValue)];
        }
        else if (inputType.category === "Quarters") {
            parts.quarter = inputValue;
        }
        else if (inputType.category === "Years") {
            parts.year = (inputValue);
        }
    }
    function parseDate(value) {
        const parts = typeof value === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
        if (parts !== null) {
            return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
        }
        return new Date(value);
    }
    const allParts = { day: true, month: true, year: true };
    function parseInputDates(inputs, idxs) {
        const n_keys = idxs.length;
        const inputDates = [];
        const inputQuarters = new Array(n_keys);
        const present = new Array(n_keys);
        if (inputs.length > 1) {
            for (let i = 0; i < n_keys; i++) {
                const datePartsObj = {};
                for (let j = 0; j < inputs.length; j++) {
                    readDatePart(datePartsObj, inputs[j].source.type, inputs[j].values[idxs[i]]);
                }
                inputQuarters[i] = datePartsObj.quarter;
                present[i] = { day: datePartsObj.day !== undefined, month: datePartsObj.month !== undefined, year: datePartsObj.year !== undefined };
                const anyPart = present[i].day || present[i].month || present[i].year || datePartsObj.quarter !== undefined;
                inputDates[i] = anyPart ? new Date(datePartsObj.year ?? 1970, datePartsObj.month ?? 0, datePartsObj.day ?? 1) : undefined;
            }
        }
        else {
            for (let i = 0; i < n_keys; i++) {
                const value = inputs[0].values[idxs[i]];
                inputDates[i] = data.isNullOrUndefined(value) ? undefined : parseDate(value);
                present[i] = allParts;
            }
        }
        return { dates: inputDates, quarters: inputQuarters, present };
    }

    const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthLong = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    function formatDateParts(date, options) {
        const result = {
            weekday: "",
            day: "",
            month: "",
            year: ""
        };
        if (options.weekday === "short") {
            result.weekday = weekdayShort[date.getDay()];
        }
        else if (options.weekday === "long") {
            result.weekday = weekdayLong[date.getDay()];
        }
        if (options.day === "2-digit") {
            result.day = String(date.getDate()).padStart(2, "0");
        }
        if (options.month === "2-digit") {
            result.month = String(date.getMonth() + 1).padStart(2, "0");
        }
        else if (options.month === "short") {
            result.month = monthShort[date.getMonth()];
        }
        else if (options.month === "long") {
            result.month = monthLong[date.getMonth()];
        }
        if (options.year === "numeric") {
            result.year = String(date.getFullYear());
        }
        else if (options.year === "2-digit") {
            result.year = String(date.getFullYear()).slice(-2);
        }
        return result;
    }

    function formatKeys(col, inputSettings, idxs) {
        const n_keys = idxs.length;
        const ret = new Array(n_keys);
        if (col.length === 1 && !(col[0].source.type?.temporal)) {
            for (let i = 0; i < n_keys; i++) {
                ret[i] = powerbi.formatPrimitiveValue(col[0].values[idxs[i]]);
            }
            return ret;
        }
        const delim = inputSettings.dates.date_format_delim;
        let allTemporal = true;
        for (let i = 0; i < col.length; i++) {
            if (!col[i].source.type?.temporal) {
                allTemporal = false;
            }
        }
        if (!allTemporal) {
            const blankKey = delim.repeat(col.length - 1);
            for (let i = 0; i < n_keys; i++) {
                let key = "";
                for (let j = 0; j < col.length; j++) {
                    if (j > 0) {
                        key += delim;
                    }
                    key += powerbi.formatPrimitiveValue(col[j].values[idxs[i]]) ?? "";
                }
                ret[i] = key === blankKey ? undefined : key;
            }
            return ret;
        }
        const inputDates = parseInputDates(col, idxs);
        const formatOptions = dateSettingsToFormatOptions(inputSettings.dates);
        const locale = inputSettings.dates.date_format_locale;
        const day_elem = locale === "en-GB" ? "day" : "month";
        const month_elem = locale === "en-GB" ? "month" : "day";
        for (let i = 0; i < n_keys; i++) {
            const date = inputDates.dates[i];
            if (data.isNullOrUndefined(date)) {
                ret[i] = undefined;
            }
            else {
                const present = inputDates.present[i];
                const datePartsRecord = formatDateParts(date, {
                    weekday: present.day && present.month && present.year ? formatOptions.weekday : undefined,
                    day: present.day ? formatOptions.day : undefined,
                    month: present.month ? formatOptions.month : undefined,
                    year: present.year ? formatOptions.year : undefined
                });
                const datePartStrings = [(datePartsRecord.weekday + " " + datePartsRecord[day_elem]).trim(),
                    datePartsRecord[month_elem],
                    inputDates.quarters[i] ?? "",
                    datePartsRecord.year];
                let key = "";
                let partCount = 0;
                for (let j = 0; j < datePartStrings.length; j++) {
                    if (!datePartStrings[j].trim()) {
                        continue;
                    }
                    if (partCount++ > 0) {
                        key += delim;
                    }
                    key += datePartStrings[j];
                }
                ret[i] = key;
            }
        }
        return ret;
    }
    function extractKeys(col, inputSettings, idxs) {
        const groupedCols = Object.create(null);
        for (let i = 0; i < col.length; i++) {
            let queryName = col[i].source.queryName ?? "";
            if (queryName.includes("Date Hierarchy")) {
                const lastDot = queryName.lastIndexOf(".");
                if (lastDot !== -1) {
                    queryName = queryName.substring(0, lastDot);
                }
            }
            (groupedCols[queryName] ?? (groupedCols[queryName] = [])).push(col[i]);
        }
        const queryNames = Object.keys(groupedCols);
        if (queryNames.length === 1) {
            return formatKeys(groupedCols[queryNames[0]], inputSettings, idxs);
        }
        const combinedKeys = new Array(idxs.length);
        for (let i = 0; i < queryNames.length; i++) {
            const groupKeys = formatKeys(groupedCols[queryNames[i]], inputSettings, idxs);
            for (let j = 0; j < idxs.length; j++) {
                const key = groupKeys[j];
                const combined = combinedKeys[j];
                if (i === 0 || combined === undefined) {
                    combinedKeys[j] = key;
                }
                else if (key !== undefined) {
                    combinedKeys[j] = `${combined} ${key}`;
                }
            }
        }
        return combinedKeys;
    }

    const sd = { name: "SD", plural: "SDs" };
    function validateInputData(keys, numerators, denominators, xbar_sds, chart_type_props) {
        const check_denom = chart_type_props.needs_denominator
            || (chart_type_props.denominator_optional && denominators !== undefined && denominators.length > 0);
        const rules = [];
        if (chart_type_props.needs_sd) {
            rules.push(data.missingRule(xbar_sds, sd), {
                fails: i => Number.isNaN(data.valueAt(xbar_sds, i)) && !data.isNullOrUndefined(numerators[i]),
                message: "SD is not a number",
                all: "All SDs are not numbers!"
            }, data.negativeRule(xbar_sds, sd));
        }
        if (check_denom) {
            rules.push(data.missingRule(denominators, data.quantity.denominator), data.nanRule(denominators, data.quantity.denominator), data.negativeRule(denominators, data.quantity.denominator), { fails: i => data.valueAt(denominators, i) === 0, message: "Denominator is zero", all: "All denominators are zero!" });
            if (chart_type_props.numerator_leq_denominator) {
                rules.push(data.ratioRule(numerators, denominators));
            }
            if (chart_type_props.denominator_gt_one) {
                rules.push({
                    fails: i => data.valueAt(denominators, i) <= 1,
                    message: "Denominator <= 1",
                    all: "All denominators are less than or equal to one!"
                });
            }
        }
        rules.push(data.missingRule(numerators, data.quantity.numerator), data.nanRule(numerators, data.quantity.numerator));
        if (chart_type_props.numerator_non_negative) {
            rules.push(data.negativeRule(numerators, data.quantity.numerator));
        }
        rules.push(data.missingRule(keys, { name: "Date", plural: "dates/IDs" }));
        return data.validateRows(keys.length, rules);
    }

    function extractInputData(view, inputSettingsClass, idxs, group = 0) {
        const inputSettings = inputSettingsClass.settings[group];
        const derivedSettings = inputSettingsClass.derivedSettings[group];
        const rowSettings = inputSettingsClass.rowSettings[group];
        const denominatorColumn = view.values.denominators?.[0];
        const sdColumn = view.values.xbar_sds?.[0];
        const chart = derivedSettings.chart_type_props;
        const keys = extractKeys(view.categories.key, inputSettings, idxs);
        const numerators = powerbi.readNumbers(view.values.numerators[0], idxs);
        const groupDenominators = (chart.needs_denominator || chart.denominator_optional) && denominatorColumn !== undefined
            ? powerbi.readNumbers(denominatorColumn, idxs) : undefined;
        let anyDenominator = false;
        for (let i = 0; !anyDenominator && groupDenominators !== undefined && i < groupDenominators.length; i++) {
            anyDenominator = groupDenominators[i] !== undefined;
        }
        const denominators = chart.needs_denominator || anyDenominator ? groupDenominators : undefined;
        const xbar_sds = chart.needs_sd && sdColumn !== undefined ? powerbi.readNumbers(sdColumn, idxs) : undefined;
        const extracted = powerbi.extractRows(view, idxs, {
            keys,
            validation: validateInputData(keys, numerators, denominators, xbar_sds, chart),
            rowSettings,
            settings: { messages: inputSettingsClass.validationStatus.messages, messagePositionByRowIndex: inputSettingsClass.messagePositionByRowIndex }
        });
        if (extracted.status === "invalid") {
            return extracted;
        }
        const { kept, warnings, ...rows } = extracted.data;
        if (chart.name === "mr" && kept.length < 2) {
            return { status: "invalid", error: "Moving range charts need at least two valid observations!" };
        }
        const groupings = view.values.groupings?.[0];
        const limitKeys = new Array(kept.length);
        const keptNumerators = new Array(kept.length);
        const keptDenominators = denominators === undefined ? undefined : new Array(kept.length);
        const keptSds = xbar_sds === undefined ? undefined : new Array(kept.length);
        const showAltTarget = inputSettings.lines.show_alt_target;
        const showSpecification = inputSettings.lines.show_specification;
        const line_formatting = new Array(kept.length);
        const alt_target = new Array(kept.length);
        const speclimits_lower = new Array(kept.length);
        const speclimits_upper = new Array(kept.length);
        const groupingIndexes = [];
        let currentGrouping;
        for (let x = 0; x < kept.length; x++) {
            const i = kept[x];
            const row = idxs[i];
            const lines = rowSettings[i].lines;
            limitKeys[x] = { x, id: row, label: chart.x_axis_use_date ? data.keptValue(keys, i) : String(x) };
            keptNumerators[x] = data.keptValue(numerators, i);
            if (keptDenominators !== undefined) {
                keptDenominators[x] = data.keptValue(denominators, i);
            }
            if (keptSds !== undefined) {
                keptSds[x] = data.keptValue(xbar_sds, i);
            }
            const specificationError = showSpecification
                ? settings.orderedPairError("specification_lower", lines.specification_lower, "specification_upper", lines.specification_upper)
                : undefined;
            if (specificationError !== undefined) {
                return { status: "invalid", error: specificationError };
            }
            line_formatting[x] = lines;
            alt_target[x] = showAltTarget ? lines.alt_target : undefined;
            speclimits_lower[x] = showSpecification ? lines.specification_lower : undefined;
            speclimits_upper[x] = showSpecification ? lines.specification_upper : undefined;
            if (groupings !== undefined) {
                const grouping = powerbi.formatPrimitiveValue(groupings.values[row]);
                if (x > 0 && grouping !== currentGrouping) {
                    groupingIndexes.push(x - 1);
                }
                currentGrouping = grouping;
            }
        }
        if (inputSettings.nhs_icons.show_assurance_icons) {
            if (showAltTarget && alt_target.length > 0 && alt_target[alt_target.length - 1] === undefined) {
                warnings.push("NHS Assurance icon requires a valid alt. target at last observation.");
            }
            if (!chart.has_control_limits) {
                warnings.push("NHS Assurance icon requires chart with control limits.");
            }
        }
        return {
            status: "valid",
            data: {
                ...rows,
                limitInputArgs: {
                    keys: limitKeys,
                    numerators: keptNumerators,
                    denominators: keptDenominators,
                    xbar_sds: keptSds,
                    outliers_in_limits: inputSettings.spc.outliers_in_limits
                },
                groupingIndexes,
                line_formatting,
                alt_target,
                speclimits_lower,
                speclimits_upper,
                warningMessage: warnings.join("\n")
            }
        };
    }

    function validateDataViewColumns(inputSettingsClass, valueColumns) {
        for (let i = 0; i < inputSettingsClass.derivedSettings.length; i++) {
            const props = inputSettingsClass.derivedSettings[i].chart_type_props;
            if (props.needs_denominator && valueColumns.denominators === undefined) {
                return `Chart type '${props.name}' requires denominators!`;
            }
            if (props.needs_sd && valueColumns.xbar_sds === undefined) {
                return `Chart type '${props.name}' requires SDs!`;
            }
        }
        return "valid";
    }

    function finiteMin(current, value) {
        return data.isValidNumber(value) ? Math.min(current, value) : current;
    }
    function finiteMax(current, value) {
        return data.isValidNumber(value) ? Math.max(current, value) : current;
    }
    function axisRanges(viewModel) {
        const controlLimits = viewModel.controlLimits[0];
        const inputSettings = viewModel.inputSettings.settings[0];
        const derivedSettings = viewModel.inputSettings.derivedSettings[0];
        const limitMultiplier = inputSettings.y_axis.limit_multiplier;
        let maxValue = Number.NEGATIVE_INFINITY;
        let minValue = Number.POSITIVE_INFINITY;
        let maxValueOrLimit = Number.NEGATIVE_INFINITY;
        let minValueOrLimit = Number.POSITIVE_INFINITY;
        let maxTarget = Number.NEGATIVE_INFINITY;
        let minTarget = Number.POSITIVE_INFINITY;
        let minKey = Number.POSITIVE_INFINITY;
        let maxKey = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < controlLimits.keys.length; i++) {
            const value = controlLimits.values[i];
            const altTarget = controlLimits.alt_target[i];
            const target = controlLimits.target[i];
            maxValue = finiteMax(maxValue, value);
            minValue = finiteMin(minValue, value);
            maxValueOrLimit = finiteMax(maxValueOrLimit, value);
            maxValueOrLimit = finiteMax(maxValueOrLimit, controlLimits.ul99[i]);
            maxValueOrLimit = finiteMax(maxValueOrLimit, controlLimits.speclimits_upper[i]);
            maxValueOrLimit = finiteMax(maxValueOrLimit, altTarget);
            minValueOrLimit = finiteMin(minValueOrLimit, value);
            minValueOrLimit = finiteMin(minValueOrLimit, controlLimits.ll99[i]);
            minValueOrLimit = finiteMin(minValueOrLimit, controlLimits.speclimits_lower[i]);
            minValueOrLimit = finiteMin(minValueOrLimit, altTarget);
            maxTarget = finiteMax(maxTarget, target);
            minTarget = finiteMin(minTarget, target);
            minKey = Math.min(minKey, controlLimits.keys[i].x);
            maxKey = Math.max(maxKey, controlLimits.keys[i].x);
        }
        if (!data.isValidNumber(maxTarget)) {
            maxTarget = (maxValueOrLimit - minValueOrLimit) / 2 + minValueOrLimit;
        }
        if (!data.isValidNumber(minTarget)) {
            minTarget = (maxValueOrLimit - minValueOrLimit) / 2 + minValueOrLimit;
        }
        const upperLimitRaw = maxTarget + (maxValueOrLimit - maxTarget) * limitMultiplier;
        const lowerLimitRaw = minTarget - (minTarget - minValueOrLimit) * limitMultiplier;
        const multiplier = derivedSettings.multiplier;
        const yUpperLimit = inputSettings.y_axis.ylimit_u
            ?? ((derivedSettings.percentLabels && !(maxValue > (1 * multiplier))) ? Math.min(upperLimitRaw, 1 * multiplier) : upperLimitRaw);
        const yLowerLimit = inputSettings.y_axis.ylimit_l
            ?? ((derivedSettings.percentLabels && !(minValue < 0)) ? Math.max(lowerLimitRaw, 0) : lowerLimitRaw);
        return {
            x: {
                lower: inputSettings.x_axis.xlimit_l ?? minKey,
                upper: inputSettings.x_axis.xlimit_u ?? maxKey
            },
            y: { lower: yLowerLimit, upper: yUpperLimit }
        };
    }

    const lineKeys = {
        ...settings.standardLineKeys,
        values: "main",
        speclimits_lower: "specification",
        speclimits_upper: "specification",
        trend_line: "trend"
    };

    const limitSeries = Object.keys({
        numerators: true,
        denominators: true,
        target: true,
        ll99: true,
        ll95: true,
        ll68: true,
        ul68: true,
        ul95: true,
        ul99: true,
        xbar_sds: true,
        alt_target: true,
        speclimits_lower: true,
        speclimits_upper: true,
        trend_line: true
    });
    function copyFlags(target, source, offset, flagSettings) {
        for (let i = 0; i < source.length; i++) {
            target[offset + i] = data.checkFlagDirection(source[i], flagSettings);
        }
    }
    const truncatedSeries = new Set(settings.limitLineNames);
    function anyIcon(icons, names) {
        for (let i = 0; i < icons.length; i++) {
            if (names.includes(icons[i])) {
                return true;
            }
        }
        return false;
    }
    function anyDefined(values) {
        for (let i = 0; i < values.length; i++) {
            if (values[i] !== undefined) {
                return true;
            }
        }
        return false;
    }
    function lineColumns(settings$1, hasNumerators, hasDenominators, hasControlLimits) {
        const lines = settings$1.lines;
        const columns = new Array();
        if (lines.show_main) {
            columns.push({ name: "value", label: "Value" });
        }
        if (hasNumerators && settings$1.spc.ttip_show_numerator) {
            columns.push({ name: "numerator", label: "Numerator" });
        }
        if (hasDenominators && settings$1.spc.ttip_show_denominator) {
            columns.push({ name: "denominator", label: "Denominator" });
        }
        if (lines.show_trend) {
            columns.push({ name: "trend_line", label: lines.ttip_label_trend });
        }
        if (lines.show_specification) {
            columns.push({
                name: "speclimits_upper",
                label: `${lines.ttip_label_specification_prefix_upper}${lines.ttip_label_specification}`
            }, {
                name: "speclimits_lower",
                label: `${lines.ttip_label_specification_prefix_lower}${lines.ttip_label_specification}`
            });
        }
        columns.push(...settings.limitColumns(lines, hasControlLimits));
        return columns;
    }
    class viewModelClass extends rendering.PlotViewModelBase {
        get showGrouped() {
            return this.inputData.length > 1;
        }
        get anyLabels() {
            return this.inputData[0].anyLabels;
        }
        constructor(host) {
            super(host, new settingsClass(), ["numerators"]);
            this.inputData = [];
            this.controlLimits = [];
            this.outliers = [];
            this.plotPoints = [];
            this.groupedRows = [];
            this.groupedLines = [];
            this.periodEnds = [];
            this.tickLabels = [];
            this.splitIndexes = [];
            this.groupStartEndIndexes = [];
            this.tableColumns = [];
            this.indicatorVarNames = [];
            this.groupNames = [];
            this.groupLabels = [];
            this.identities = [];
        }
        get hasAxes() {
            return !this.showGrouped;
        }
        axisRanges() {
            return axisRanges(this);
        }
        reset() {
            this.inputData = [];
            this.controlLimits = [];
            this.groupStartEndIndexes = [];
            this.outliers = [];
            this.identities = [];
            this.plotPoints = [];
            this.groupedRows = [];
            this.groupedLines = [];
            this.tickLabels = [];
        }
        updateData(view, indicatorGroups, host) {
            const indicator_cols = view.categories.indicator ?? [];
            this.indicatorVarNames = new Array(indicator_cols.length);
            for (let i = 0; i < indicator_cols.length; i++) {
                this.indicatorVarNames[i] = indicator_cols[i].source.displayName;
            }
            const idx_per_indicator = indicatorGroups.rows;
            this.groupNames = indicatorGroups.names;
            this.groupLabels = indicatorGroups.labels;
            const checkDV = validateDataViewColumns(this.inputSettings, view.values);
            if (checkDV !== "valid") {
                return { errors: [checkDV], warnings: [] };
            }
            const hasIndicator = indicator_cols.length > 0;
            const split_indexes_str = (view.dataView.metadata.objects?.split_indexes_storage?.split_indexes) ?? "[]";
            const split_indexes = JSON.parse(split_indexes_str);
            this.splitIndexes = hasIndicator ? [] : split_indexes;
            this.inputData = new Array();
            this.groupStartEndIndexes = new Array();
            this.controlLimits = new Array();
            this.outliers = new Array();
            this.identities = new Array();
            this.tableColumns = new Array();
            const errors = [];
            const warnings = [];
            for (let idx = 0; idx < idx_per_indicator.length; idx++) {
                const group_idxs = idx_per_indicator[idx];
                const settings = this.inputSettings.settings[idx];
                const derivedSettings = this.inputSettings.derivedSettings[idx];
                const extraction = extractInputData(view, this.inputSettings, group_idxs, idx);
                if (extraction.status !== "valid") {
                    errors.push(powerbi.labelledMessage(this.groupLabels[idx], extraction.error));
                    continue;
                }
                const inpData = extraction.data;
                this.inputData.push(inpData);
                if (inpData.warningMessage !== "") {
                    warnings.push(powerbi.labelledMessage(this.groupLabels[idx], inpData.warningMessage));
                }
                const inputGroupStartEnd = this.getGroupingIndexes(inpData, idx === 0 ? this.splitIndexes : undefined);
                const limits = this.calculateLimits(inpData, inputGroupStartEnd, settings);
                const groupStartEnd = this.getResultGroupIndexes(limits.keys, inputGroupStartEnd);
                this.scaleAndTruncateLimits(limits, settings, derivedSettings);
                const outliers = this.flagOutliers(limits, groupStartEnd, settings, derivedSettings);
                const keys = inpData.limitInputArgs.keys;
                const identities = new Array(keys.length);
                for (let i = 0; i < keys.length; i++) {
                    identities[i] = powerbi.rowIdentity(host, inpData.identityColumns, keys[i].id);
                }
                this.groupStartEndIndexes.push(groupStartEnd);
                this.controlLimits.push(limits);
                this.outliers.push(outliers);
                this.identities.push(identities);
            }
            if (errors.length === 0) {
                if (this.showGrouped) {
                    this.initialisePlotDataGrouped();
                }
                else if (this.controlLimits[0].keys.length === 0) {
                    errors.push("Moving range charts need at least two observations in the same rebaseline group!");
                }
                else {
                    this.initialisePlotData();
                    this.initialiseGroupedLines();
                }
            }
            return { errors, warnings };
        }
        getGroupingIndexes(inputData, splitIndexes) {
            const lastIndex = inputData.limitInputArgs.keys.length - 1;
            const segmentEnds = new Set([-1, lastIndex]);
            if (splitIndexes !== undefined) {
                for (let i = 0; i < splitIndexes.length; i++) {
                    const index = splitIndexes[i];
                    if (index >= 0 && index < lastIndex) {
                        segmentEnds.add(index);
                    }
                }
            }
            for (let i = 0; i < inputData.groupingIndexes.length; i++) {
                segmentEnds.add(inputData.groupingIndexes[i]);
            }
            const allIndexes = Array.from(segmentEnds).sort((a, b) => a - b);
            const groupStartEndIndexes = new Array();
            for (let i = 0; i < allIndexes.length - 1; i++) {
                groupStartEndIndexes.push([allIndexes[i] + 1, allIndexes[i + 1] + 1]);
            }
            return groupStartEndIndexes;
        }
        getResultGroupIndexes(keys, inputGroupStartEnd) {
            const result = new Array(inputGroupStartEnd.length);
            let position = 0;
            for (let i = 0; i < inputGroupStartEnd.length; i++) {
                const start = position;
                while (position < keys.length && keys[position].x < inputGroupStartEnd[i][1]) {
                    position++;
                }
                result[i] = [start, position];
            }
            return result;
        }
        calculateLimits(inputData, groupStartEndIndexes, inputSettings) {
            const limitFunction = limitFunctions[inputSettings.spc.chart_type];
            const num_points_subset = inputSettings.spc.num_points_subset;
            const subset_points_from = inputSettings.spc.subset_points_from;
            const subset_rebaselines = inputSettings.spc.subset_rebaselines;
            const args = inputData.limitInputArgs;
            const segments = new Array(groupStartEndIndexes.length);
            let total = 0;
            for (let g = 0; g < groupStartEndIndexes.length; g++) {
                const start = groupStartEndIndexes[g][0];
                const end = groupStartEndIndexes[g][1];
                const n = end - start;
                const applySubset = g === 0 || subset_rebaselines;
                const subsetCount = applySubset && !data.isNullOrUndefined(num_points_subset) && math.between(num_points_subset, 1, n)
                    ? num_points_subset : n;
                const subsetStart = subset_points_from === "Start" ? 0 : n - subsetCount;
                segments[g] = limitFunction({
                    keys: args.keys.slice(start, end),
                    numerators: args.numerators.slice(start, end),
                    denominators: args.denominators?.slice(start, end),
                    xbar_sds: args.xbar_sds?.slice(start, end),
                    outliers_in_limits: inputSettings.spc.outliers_in_limits,
                    subset_points: math.sequence(subsetStart, subsetCount, 1)
                });
                total += segments[g].keys.length;
            }
            const controlLimits = {
                keys: new Array(total),
                values: new Array(total),
                numerators: new Array(total),
                denominators: new Array(total),
                target: new Array(total),
                ll99: new Array(total),
                ll95: new Array(total),
                ll68: new Array(total),
                ul68: new Array(total),
                ul95: new Array(total),
                ul99: new Array(total),
                xbar_sds: new Array(total),
                alt_target: new Array(total),
                speclimits_lower: new Array(total),
                speclimits_upper: new Array(total),
                trend_line: new Array(total)
            };
            const perRow = {
                alt_target: inputData.alt_target,
                speclimits_lower: inputData.speclimits_lower,
                speclimits_upper: inputData.speclimits_upper
            };
            let position = 0;
            for (let g = 0; g < segments.length; g++) {
                const group = segments[g];
                const trend_line = math.calculateTrendLine(group.values);
                for (let i = 0; i < group.keys.length; i++) {
                    const key = group.keys[i];
                    controlLimits.keys[position] = key;
                    controlLimits.values[position] = group.values[i];
                    for (let s = 0; s < limitSeries.length; s++) {
                        const name = limitSeries[s];
                        const rows = perRow[name];
                        const value = rows !== undefined ? rows[key.x] : name === "trend_line" ? trend_line[i] : group[name]?.[i];
                        controlLimits[name][position] = data.isValidNumber(value) ? value : undefined;
                    }
                    position++;
                }
            }
            return controlLimits;
        }
        initialisePlotDataGrouped() {
            this.plotPoints = [];
            this.groupedRows = [];
            this.tableColumns = new Array();
            const tableColumnsDef = new Array();
            for (let i = 0; i < this.indicatorVarNames.length; i++) {
                tableColumnsDef.push({ name: `indicator_${i}`, label: this.indicatorVarNames[i] });
            }
            tableColumnsDef.push({ name: "latest_date", label: "Latest Date" });
            let anyNumerators = false;
            let anyDenominators = false;
            let anyControlLimits = false;
            for (let i = 0; i < this.controlLimits.length; i++) {
                anyNumerators = anyNumerators || anyDefined(this.controlLimits[i].numerators);
                anyDenominators = anyDenominators || anyDefined(this.controlLimits[i].denominators);
                anyControlLimits = anyControlLimits || this.inputSettings.derivedSettings[i].chart_type_props.has_control_limits;
            }
            tableColumnsDef.push(...lineColumns(this.inputSettings.settings[0], anyNumerators, anyDenominators, anyControlLimits));
            const nhsIconSettings = this.inputSettings.settings[0].nhs_icons;
            if (nhsIconSettings.show_variation_icons) {
                tableColumnsDef.push({ name: "variation", label: "Variation" });
            }
            if (nhsIconSettings.show_assurance_icons) {
                tableColumnsDef.push({ name: "assurance", label: "Assurance" });
            }
            let anyTooltips = false;
            for (let i = 0; i < this.inputData.length && !anyTooltips; i++) {
                const rowTooltips = this.inputData[i].tooltips;
                for (let j = 0; j < rowTooltips.length && !anyTooltips; j++) {
                    anyTooltips = rowTooltips[j].length > 0;
                }
            }
            if (anyTooltips) {
                const firstTooltips = this.inputData[0].tooltips[0];
                for (let i = 0; i < firstTooltips.length; i++) {
                    tableColumnsDef.push({ name: `tooltip_${i}`, label: firstTooltips[i].displayName });
                }
            }
            this.tableColumns[0] = tableColumnsDef;
            for (let i = 0; i < this.groupNames.length; i++) {
                const formatValues = this.inputSettings.derivedSettings[i].formatValue;
                const varIconFilter = this.inputSettings.settings[i].summary_table.table_variation_filter;
                const assIconFilter = this.inputSettings.settings[i].summary_table.table_assurance_filter;
                const limits = this.controlLimits[i];
                const outliers = this.outliers[i];
                const lastIndex = limits.keys.length - 1;
                const lastKey = limits.keys[lastIndex];
                const varIcons = lastKey === undefined ? [] : variationIconsToDraw(outliers, this.inputSettings.settings[i]);
                if (varIconFilter !== "all") {
                    if (varIconFilter === "improvement" && !anyIcon(varIcons, ["improvementHigh", "improvementLow"])) {
                        continue;
                    }
                    if (varIconFilter === "deterioration" && !anyIcon(varIcons, ["concernHigh", "concernLow"])) {
                        continue;
                    }
                    if (varIconFilter === "neutral" && !anyIcon(varIcons, ["neutralHigh", "neutralLow"])) {
                        continue;
                    }
                    if (varIconFilter === "common" && varIcons[0] !== "commonCause") {
                        continue;
                    }
                    if (varIconFilter === "special" && varIcons[0] === "commonCause") {
                        continue;
                    }
                }
                const assIcon = assuranceIconToDraw(limits, this.inputSettings.settings[i], this.inputSettings.derivedSettings[i]);
                if (assIconFilter !== "all") {
                    if (assIconFilter === "any" && assIcon !== "consistentPass" && assIcon !== "consistentFail") {
                        continue;
                    }
                    if (assIconFilter === "pass" && assIcon !== "consistentPass") {
                        continue;
                    }
                    if (assIconFilter === "fail" && assIcon !== "consistentFail") {
                        continue;
                    }
                    if (assIconFilter === "inconsistent" && assIcon !== "inconsistent") {
                        continue;
                    }
                }
                const indicatorColumns = {};
                for (let idx = 0; idx < this.indicatorVarNames.length; idx++) {
                    indicatorColumns[`indicator_${idx}`] = this.groupNames[i][idx];
                }
                const tooltipColumns = {};
                if (anyTooltips) {
                    const rowTooltips = this.inputData[i].tooltips[lastKey?.x ?? 0];
                    for (let t = 0; t < rowTooltips.length; t++) {
                        tooltipColumns[`tooltip_${t}`] = lastKey === undefined ? "" : rowTooltips[t].value;
                    }
                }
                const table_row = {
                    ...indicatorColumns,
                    latest_date: lastKey?.label ?? "",
                    value: formatValues(limits.values[lastIndex], "value"),
                    numerator: formatValues(limits.numerators[lastIndex], "input"),
                    denominator: formatValues(limits.denominators[lastIndex], "input"),
                    target: formatValues(limits.target[lastIndex], "value"),
                    alt_target: formatValues(limits.alt_target[lastIndex], "value"),
                    ul99: formatValues(limits.ul99[lastIndex], "value"),
                    ul95: formatValues(limits.ul95[lastIndex], "value"),
                    ul68: formatValues(limits.ul68[lastIndex], "value"),
                    ll68: formatValues(limits.ll68[lastIndex], "value"),
                    ll95: formatValues(limits.ll95[lastIndex], "value"),
                    ll99: formatValues(limits.ll99[lastIndex], "value"),
                    speclimits_lower: formatValues(limits.speclimits_lower[lastIndex], "value"),
                    speclimits_upper: formatValues(limits.speclimits_upper[lastIndex], "value"),
                    trend_line: formatValues(limits.trend_line[lastIndex], "value"),
                    assurance: assIcon,
                    ...tooltipColumns
                };
                this.groupedRows.push({
                    table_row,
                    variation_icons: varIcons,
                    identity: this.identities[i],
                    aesthetics: this.inputSettings.settings[i].summary_table,
                    highlighted: this.inputData[i].anyHighlights
                });
            }
        }
        initialisePlotData() {
            const inputData = this.inputData[0];
            const controlLimits = this.controlLimits[0];
            const outliers = this.outliers[0];
            const identities = this.identities[0];
            const settings = this.inputSettings.settings[0];
            const derivedSettings = this.inputSettings.derivedSettings[0];
            this.plotPoints = [];
            this.groupedRows = [];
            this.tickLabels = new Array();
            this.tableColumns[0] = new Array();
            this.tableColumns[0].push({ name: "date", label: "Date" });
            this.tableColumns[0].push(...lineColumns(settings, anyDefined(controlLimits.numerators), anyDefined(controlLimits.denominators), derivedSettings.chart_type_props.has_control_limits));
            if (settings.outliers.astronomical) {
                this.tableColumns[0].push({ name: "astpoint", label: "Ast. Point" });
            }
            if (settings.outliers.trend) {
                this.tableColumns[0].push({ name: "trend", label: "Trend" });
            }
            if (settings.outliers.shift) {
                this.tableColumns[0].push({ name: "shift", label: "Shift" });
            }
            if (settings.outliers.two_in_three) {
                this.tableColumns[0].push({ name: "two_in_three", label: "Two-in-Three" });
            }
            for (let i = 0; i < controlLimits.keys.length; i++) {
                const index = controlLimits.keys[i].x;
                const aesthetics = { ...inputData.scatter_formatting[index] };
                if (this.colourPalette.isHighContrast) {
                    aesthetics.colour = this.colourPalette.foregroundColour;
                }
                data.applyFlagColours(aesthetics, settings.outliers, [
                    [outliers.shift[i], "shift_colour"], [outliers.trend[i], "trend_colour"],
                    [outliers.two_in_three[i], "twointhree_colour"], [outliers.astpoint[i], "ast_colour"]
                ]);
                const table_row = {
                    date: controlLimits.keys[i].label,
                    numerator: controlLimits.numerators[i],
                    denominator: controlLimits.denominators[i],
                    xbar_sd: controlLimits.xbar_sds[i],
                    value: controlLimits.values[i],
                    target: controlLimits.target[i],
                    alt_target: controlLimits.alt_target[i],
                    ll99: controlLimits.ll99[i],
                    ll95: controlLimits.ll95[i],
                    ll68: controlLimits.ll68[i],
                    ul68: controlLimits.ul68[i],
                    ul95: controlLimits.ul95[i],
                    ul99: controlLimits.ul99[i],
                    speclimits_lower: controlLimits.speclimits_lower[i],
                    speclimits_upper: controlLimits.speclimits_upper[i],
                    trend_line: controlLimits.trend_line[i],
                    astpoint: outliers.astpoint[i],
                    trend: outliers.trend[i],
                    shift: outliers.shift[i],
                    two_in_three: outliers.two_in_three[i]
                };
                this.plotPoints.push({
                    x: index,
                    value: controlLimits.values[i],
                    aesthetics: aesthetics,
                    table_row: table_row,
                    identity: identities[index],
                    highlighted: inputData.highlights[index] !== undefined,
                    tooltip: buildTooltip(table_row, inputData.tooltips[index], settings, derivedSettings),
                    label: {
                        text_value: inputData.labels[index],
                        aesthetics: inputData.label_formatting[index],
                        angle: undefined,
                        distance: undefined
                    }
                });
                this.tickLabels.push({ x: index, label: controlLimits.keys[i].label });
            }
        }
        initialiseGroupedLines() {
            const settings = this.inputSettings.settings[0];
            const derivedSettings = this.inputSettings.derivedSettings[0];
            const controlLimits = this.controlLimits[0];
            const inputData = this.inputData[0];
            const labels = [];
            if (settings.lines.show_main) {
                labels.push("values");
            }
            if (settings.lines.show_target) {
                labels.push("target");
            }
            if (settings.lines.show_alt_target) {
                labels.push("alt_target");
            }
            if (settings.lines.show_specification) {
                labels.push("speclimits_lower", "speclimits_upper");
            }
            if (settings.lines.show_trend) {
                labels.push("trend_line");
            }
            if (derivedSettings.chart_type_props.has_control_limits) {
                if (settings.lines.show_99) {
                    labels.push("ll99", "ul99");
                }
                if (settings.lines.show_95) {
                    labels.push("ll95", "ul95");
                }
                if (settings.lines.show_68) {
                    labels.push("ll68", "ul68");
                }
            }
            const lines = new Array(labels.length);
            for (let l = 0; l < labels.length; l++) {
                lines[l] = [labels[l], []];
            }
            const nLimits = controlLimits.keys.length;
            const groups = this.groupStartEndIndexes[0];
            const isGroupStart = new Array(nLimits).fill(false);
            for (let i = 1; i < groups.length; i++) {
                isGroupStart[groups[i][0]] = true;
            }
            this.periodEnds = [];
            let position = 0;
            for (let i = 0; i < nLimits; i++) {
                const isRebaselinePoint = isGroupStart[i];
                let isNewAltTarget = false;
                if (i > 0 && settings.lines.show_alt_target) {
                    isNewAltTarget = controlLimits.alt_target[i] !== controlLimits.alt_target[i - 1];
                }
                if (isRebaselinePoint) {
                    this.periodEnds.push(position - 1);
                }
                position += 1 + (isRebaselinePoint ? 1 : 0) + (isNewAltTarget ? 2 : 0);
                const x = controlLimits.keys[i].x;
                const aesthetics = inputData.line_formatting[x];
                for (let l = 0; l < labels.length; l++) {
                    const label = labels[l];
                    const formattedLines = lines[l][1];
                    const join_rebaselines = settings.lines[`join_rebaselines_${lineKeys[label]}`];
                    const value = controlLimits[label][i];
                    const is_alt_target = label === "alt_target";
                    if (isRebaselinePoint) {
                        formattedLines.push({
                            x,
                            line_value: (!join_rebaselines && !is_alt_target) ? undefined : value,
                            group: label,
                            aesthetics
                        });
                    }
                    if (isNewAltTarget) {
                        formattedLines.push({
                            x,
                            line_value: is_alt_target ? controlLimits.alt_target[i - 1] : value,
                            group: label,
                            aesthetics
                        }, {
                            x,
                            line_value: (is_alt_target && !join_rebaselines) ? undefined : value,
                            group: label,
                            aesthetics
                        });
                    }
                    formattedLines.push({ x, line_value: value, group: label, aesthetics });
                }
            }
            this.periodEnds.push(position - 1);
            this.groupedLines = lines;
        }
        scaleAndTruncateLimits(controlLimits, inputSettings, derivedSettings) {
            const multiplier = derivedSettings.multiplier;
            const ll_truncate = inputSettings.spc.ll_truncate;
            const ul_truncate = inputSettings.spc.ul_truncate;
            const lines_to_scale = ["values", "target", "trend_line", "xbar_sds"];
            if (derivedSettings.chart_type_props.has_control_limits) {
                lines_to_scale.push(...settings.limitLineNames);
            }
            if (inputSettings.lines.show_alt_target && inputSettings.lines.multiplier_alt_target) {
                lines_to_scale.push("alt_target");
            }
            if (inputSettings.lines.show_specification && inputSettings.lines.multiplier_specification) {
                lines_to_scale.push("speclimits_lower", "speclimits_upper");
            }
            for (let l = 0; l < lines_to_scale.length; l++) {
                const name = lines_to_scale[l];
                const series = controlLimits[name];
                const lower = truncatedSeries.has(name) ? ll_truncate : undefined;
                const upper = truncatedSeries.has(name) ? ul_truncate : undefined;
                for (let i = 0; i < series.length; i++) {
                    const value = series[i];
                    if (value !== undefined) {
                        series[i] = math.clamp(value * multiplier, lower, upper);
                    }
                }
            }
        }
        flagOutliers(controlLimits, groupStartEndIndexes, inputSettings, derivedSettings) {
            const process_flag_type = inputSettings.outliers.process_flag_type;
            const improvement_direction = inputSettings.outliers.improvement_direction;
            const trend_n = inputSettings.outliers.trend_n;
            const shift_n = inputSettings.outliers.shift_n;
            const ast_specification = inputSettings.outliers.astronomical_limit === "Specification";
            const two_in_three_specification = inputSettings.outliers.two_in_three_limit === "Specification";
            const flagSettings = { process_flag_type, improvement_direction };
            const outliers = {
                astpoint: math.rep("none", controlLimits.values.length),
                two_in_three: math.rep("none", controlLimits.values.length),
                trend: math.rep("none", controlLimits.values.length),
                shift: math.rep("none", controlLimits.values.length)
            };
            for (let i = 0; i < groupStartEndIndexes.length; i++) {
                const start = groupStartEndIndexes[i][0];
                const end = groupStartEndIndexes[i][1];
                const group_values = controlLimits.values.slice(start, end);
                const group_targets = controlLimits.target.slice(start, end);
                if (derivedSettings.chart_type_props.has_control_limits || ast_specification || two_in_three_specification) {
                    const limitKeys = {
                        "1 Sigma": ["ll68", "ul68"],
                        "2 Sigma": ["ll95", "ul95"],
                        "3 Sigma": ["ll99", "ul99"],
                        "Specification": ["speclimits_lower", "speclimits_upper"]
                    };
                    if (inputSettings.outliers.astronomical) {
                        const astKeys = limitKeys[inputSettings.outliers.astronomical_limit];
                        const lower_limits = controlLimits[astKeys[0]].slice(start, end);
                        const upper_limits = controlLimits[astKeys[1]].slice(start, end);
                        copyFlags(outliers.astpoint, spc.astronomical(group_values, lower_limits, upper_limits), start, flagSettings);
                    }
                    if (inputSettings.outliers.two_in_three) {
                        const highlight_series = inputSettings.outliers.two_in_three_highlight_series;
                        const warnKeys = limitKeys[inputSettings.outliers.two_in_three_limit];
                        const lower_warn_limits = controlLimits[warnKeys[0]].slice(start, end);
                        const upper_warn_limits = controlLimits[warnKeys[1]].slice(start, end);
                        copyFlags(outliers.two_in_three, spc.twoInThree(group_values, lower_warn_limits, upper_warn_limits, highlight_series), start, flagSettings);
                    }
                }
                if (inputSettings.outliers.trend) {
                    copyFlags(outliers.trend, spc.trend(group_values, trend_n), start, flagSettings);
                }
                if (inputSettings.outliers.shift) {
                    copyFlags(outliers.shift, spc.shift(group_values, group_targets, shift_n), start, flagSettings);
                }
            }
            return outliers;
        }
    }

    const lowerLines = new Set(settings.lowerLimitLines).add("speclimits_lower");
    class Visual extends rendering.PlotVisual {
        constructor(options) {
            super(options, host => new viewModelClass(host));
            this.lineKeys = lineKeys;
            this.tableDiv = rendering.createTableContainer(this.element);
        }
        get settings() {
            return this.viewModel.inputSettings.settings[0];
        }
        drawAlternate() {
            if (!(this.viewModel.showGrouped || this.settings.summary_table.show_table)) {
                return undefined;
            }
            this.resizeCanvas(0, 0);
            this.tableDiv.call(drawSummaryTable, this);
            this.addContextMenu(this.tableDiv.node(), true);
            return "table";
        }
        plotOptions() {
            const viewModel = this.viewModel;
            const settings = this.settings;
            const tickLabels = viewModel.tickLabels;
            const derivedSettings = viewModel.inputSettings.derivedSettings[0];
            const integerTicks = derivedSettings.chart_type_props.integer_values && derivedSettings.multiplier === 1;
            return {
                tickFormats: {
                    x: value => {
                        for (let i = 0; i < tickLabels.length; i++) {
                            if (tickLabels[i].x === value) {
                                return tickLabels[i].label;
                            }
                        }
                        return "";
                    },
                    y: rendering.valueTickFormat(settings.y_axis.ylimit_sig_figs ?? (integerTicks ? 0 : settings.spc.sig_figs), derivedSettings.percentLabels),
                    yInteger: integerTicks
                },
                verticalCrosshair: false,
                lineSettings: (points, index) => points[index].aesthetics,
                lowerLines,
                dots: {
                    show: settings.scatter.show_dots,
                    text: undefined,
                    onClick: settings.spc.split_on_click ? point => this.toggleSplit(point) : undefined
                }
            };
        }
        drawMarks(marks) {
            marks.call(drawIcons, this);
        }
        toggleSplit(point) {
            const splitIndexes = this.viewModel.splitIndexes;
            const xIndex = splitIndexes.indexOf(point.x);
            if (xIndex > -1) {
                splitIndexes.splice(xIndex, 1);
            }
            else {
                splitIndexes.push(point.x);
            }
            this.host.persistProperties({
                replace: [{
                        objectName: "split_indexes_storage",
                        selector: {},
                        properties: { split_indexes: JSON.stringify(splitIndexes) }
                    }]
            });
        }
        resizeCanvas(width, height) {
            super.resizeCanvas(width, height);
            rendering.showTable(this.tableDiv, width === 0 && height === 0);
        }
        updateHighlighting() {
            const viewModel = this.viewModel;
            let anyHighlights = false;
            for (let i = 0; i < viewModel.inputData.length && !anyHighlights; i++) {
                anyHighlights = viewModel.inputData[i].anyHighlights;
            }
            const state = powerbi.selectionState(this.selectionManager, anyHighlights);
            this.highlightPlotPoints(state, point => point.aesthetics);
            rendering.highlightTable(this.tableDiv, state, d => ({
                opacity: d.aesthetics.table_opacity,
                opacity_selected: d.aesthetics.table_opacity_selected,
                opacity_unselected: d.aesthetics.table_opacity_unselected
            }));
        }
    }

    const limitColumns = [
        "date", "numerator", "denominator", "value", "target", "alt_target", "ll99", "ll95", "ll68", "ul68", "ul95", "ul99",
        "speclimits_lower", "speclimits_upper", "trend_line", "astpoint", "trend", "shift", "two_in_three"
    ];
    const flagSettings = {
        astpoint: "astronomical",
        trend: "trend",
        shift: "shift",
        two_in_three: "two_in_three"
    };
    function hasValues(column) {
        for (let i = 0; i < column.length; i++) {
            if (frontends.limitValue(column[i]) !== null) {
                return true;
            }
        }
        return false;
    }
    function appendLimitRows(rows, rowIds, limits, outliers, outlierSettings, indicators) {
        const dates = new Array(limits.keys.length);
        for (let i = 0; i < dates.length; i++) {
            dates[i] = limits.keys[i].label.trim();
        }
        const columns = {
            date: dates,
            numerator: limits.numerators,
            denominator: limits.denominators,
            value: limits.values,
            target: limits.target,
            alt_target: limits.alt_target,
            ll99: limits.ll99,
            ll95: limits.ll95,
            ll68: limits.ll68,
            ul68: limits.ul68,
            ul95: limits.ul95,
            ul99: limits.ul99,
            speclimits_lower: limits.speclimits_lower,
            speclimits_upper: limits.speclimits_upper,
            trend_line: limits.trend_line,
            astpoint: outliers.astpoint,
            trend: outliers.trend,
            shift: outliers.shift,
            two_in_three: outliers.two_in_three
        };
        const names = [];
        for (let i = 0; i < limitColumns.length; i++) {
            const flagSetting = flagSettings[limitColumns[i]];
            if ((flagSetting === undefined || outlierSettings[flagSetting]) && hasValues(columns[limitColumns[i]])) {
                names.push(limitColumns[i]);
            }
        }
        for (let i = 0; i < dates.length; i++) {
            const row = { ...indicators };
            for (let j = 0; j < names.length; j++) {
                row[names[j]] = frontends.limitValue(columns[names[j]][i]);
            }
            rows.push(row);
            rowIds.push(limits.keys[i].id);
        }
    }
    function chartLimits(viewModel) {
        const result = [];
        const rowIds = [];
        for (let i = 0; i < viewModel.controlLimits.length; i++) {
            const limits = viewModel.controlLimits[i];
            if (limits.keys.length === 0) {
                continue;
            }
            const indicators = {};
            const columns = viewModel.inputData[i].identityColumns;
            for (let j = 0; j < columns.length; j++) {
                const column = columns[j];
                if (column.source.roles?.indicator) {
                    indicators[column.source.displayName] = frontends.limitValue(powerbi.formatPrimitiveValue(column.values[limits.keys[0].id]));
                }
            }
            appendLimitRows(result, rowIds, limits, viewModel.outliers[i], viewModel.inputSettings.settings[i].outliers, frontends.indicatorFields(indicators, limitColumns));
        }
        return { limits: result, rowIds };
    }
    const frontend = {
        Visual,
        settingsModel,
        limitColumns,
        limits: visual => chartLimits(visual.viewModel)
    };

    frontends.registerChart('spc', frontend);

    exports.Visual = Visual;
    exports.defaultSettings = defaultSettings;

    return exports;

})({}, ccCore, ccCore, ccCore, ccCore, ccCore, ccCore, ccCore);
